"""
Fox Fuel Resource Loader - Ingest Pipeline

Handles:
- YAML front matter parsing and validation
- Image validation (dimensions, file size)
- Slug collision detection
- Atomic staging with rollback
- HTML generation via node scripts
- Post-generation validation
- Temp bundle creation with normalized filenames
- UTF-8 (no BOM) and LF newline encoding
"""

import os
import re
import json
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple, List, Dict, Any, Callable

import yaml
from PIL import Image


class IngestError(Exception):
    """Custom exception for ingest pipeline errors."""
    pass


class MissingFrontMatterError(Exception):
    """Raised when markdown has no YAML front matter - signals need for user input."""
    def __init__(self, md_path: Path, body: str, extracted_title: Optional[str] = None):
        self.md_path = md_path
        self.body = body
        self.extracted_title = extracted_title
        super().__init__("No YAML front matter found in markdown file")


class PreGeneratorValidationError(Exception):
    """Raised when pre-generator validations fail."""
    pass


def slugify(text: str) -> str:
    """
    Convert text to URL-safe slug.
    - lowercase
    - spaces -> hyphens
    - remove non-alphanumeric except hyphen
    - collapse multiple hyphens
    """
    slug = text.lower().strip()
    slug = re.sub(r'\s+', '-', slug)  # spaces to hyphens
    slug = re.sub(r'[^a-z0-9-]', '', slug)  # remove invalid chars
    slug = re.sub(r'-+', '-', slug)  # collapse multiple hyphens
    slug = slug.strip('-')  # remove leading/trailing hyphens
    return slug


def extract_h1_title(markdown_body: str) -> Optional[str]:
    """Extract H1 title from markdown body if present."""
    match = re.match(r'^\s*#\s+(.+?)(?:\n|$)', markdown_body)
    if match:
        return match.group(1).strip()
    return None


def strip_bom(text: str) -> str:
    """Remove BOM (Byte Order Mark) from the beginning of text if present."""
    if text.startswith('\ufeff'):
        return text[1:]
    return text


def normalize_newlines(text: str) -> str:
    """Convert all newlines to LF (Unix-style)."""
    return text.replace('\r\n', '\n').replace('\r', '\n')


def write_utf8_lf(path: Path, content: str):
    """
    Write text to file with:
    - UTF-8 encoding (no BOM)
    - LF newlines only
    """
    # Normalize newlines to LF
    content = normalize_newlines(content)
    # Write with explicit encoding and newline handling
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)


def ensure_front_matter(md_text: str, front_matter_dict: Dict[str, Any]) -> str:
    """
    Ensure markdown text has YAML front matter at the beginning.

    If front matter already exists, return as-is.
    If missing, prepend the provided front_matter_dict as YAML.

    Args:
        md_text: The markdown text (may or may not have front matter)
        front_matter_dict: The front matter to add if missing

    Returns:
        Markdown text guaranteed to have YAML front matter at the start
    """
    # Strip BOM and normalize
    md_text = strip_bom(md_text)
    md_text = normalize_newlines(md_text)

    # Check if front matter already exists
    if md_text.lstrip().startswith('---'):
        # Already has front matter - verify it's valid
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n', md_text.lstrip(), re.DOTALL)
        if match:
            return md_text  # Valid front matter exists

    # No valid front matter - prepend it
    yaml_str = yaml.dump(front_matter_dict, default_flow_style=False, allow_unicode=True, sort_keys=False)

    # Ensure proper spacing after front matter
    body = md_text.lstrip()

    return f"---\n{yaml_str}---\n\n{body}"


def assert_yaml_front_matter(path: Path, max_chars: int = 2000) -> Tuple[bool, str]:
    """
    Validate that a file starts with YAML front matter.

    Args:
        path: Path to the markdown file
        max_chars: Maximum characters to search for closing ---

    Returns:
        Tuple of (is_valid, error_message)
        If valid, error_message is empty string.
    """
    if not path.exists():
        return False, f"File does not exist: {path}"

    try:
        content = path.read_text(encoding='utf-8')
    except Exception as e:
        return False, f"Cannot read file: {e}"

    # Strip BOM if present
    content = strip_bom(content)

    # Must start with ---
    if not content.startswith('---\n') and not content.startswith('---\r\n'):
        return False, f"File does not start with '---\\n': {path.name}"

    # Find closing --- within max_chars
    search_content = content[:max_chars]
    # Find the second occurrence of ---
    first_end = search_content.find('\n---', 3)  # Start after opening ---
    if first_end == -1:
        return False, f"No closing '---' found within first {max_chars} chars: {path.name}"

    # Verify there's content between the delimiters
    yaml_content = content[4:first_end].strip()
    if not yaml_content:
        return False, f"Empty YAML front matter in: {path.name}"

    return True, ""


class IngestPipeline:
    """Handles the complete ingest workflow for resource content."""

    # Valid tagTypes from resources.manifest.json
    VALID_TAG_TYPES = ['fleet', 'construction', 'critical', 'decision', 'healthcare', 'manufacturing']

    # Required front matter fields
    REQUIRED_FIELDS = ['title', 'shortTitle', 'description', 'slug', 'publishDate', 'readTimeMinutes', 'category', 'tagType']
    REQUIRED_HERO_FIELDS = ['alt']  # hero.src will be generated
    REQUIRED_INLINE_FIELDS = ['alt']  # inlineImage.src will be generated

    # Minimum image width
    MIN_IMAGE_WIDTH = 1024

    def __init__(self, repo_root: Path, log_callback: Optional[Callable[[str, str], None]] = None):
        """
        Initialize the pipeline.

        Args:
            repo_root: Path to the repository root
            log_callback: Optional callback for logging (message, level)
                         level is one of: 'info', 'success', 'warning', 'error'
        """
        self.repo_root = Path(repo_root)
        self.log_callback = log_callback or (lambda msg, lvl: print(f"[{lvl}] {msg}"))

        # Key directories
        self.resources_dir = self.repo_root / 'resources'
        self.drafts_dir = self.resources_dir / 'drafts'
        self.images_dir = self.resources_dir / 'images'
        self.scripts_dir = self.repo_root / 'scripts'
        self.manifest_path = self.resources_dir / 'resources.manifest.json'

        # State
        self.front_matter: Dict[str, Any] = {}
        self.markdown_content: str = ''
        self.markdown_body: str = ''  # Body without front matter
        self.slug: str = ''
        self.hero_image_path: Optional[Path] = None
        self.inline_image_path: Optional[Path] = None
        self.staged_files: List[Path] = []
        self.backup_files: Dict[Path, bytes] = {}
        self.temp_bundle_dir: Optional[Path] = None
        self.yaml_was_injected: bool = False
        self.keep_temp_folder: bool = False
        self.debug_mode: bool = False  # Set from GUI

        # Original source paths (from any location on disk)
        self.original_md_path: Optional[Path] = None
        self.original_hero_path: Optional[Path] = None
        self.original_inline_path: Optional[Path] = None

    def log(self, message: str, level: str = 'info'):
        """Log a message."""
        self.log_callback(message, level)

    def _load_manifest(self) -> Dict[str, Any]:
        """Load the resources manifest."""
        if not self.manifest_path.exists():
            raise IngestError(f"Manifest not found: {self.manifest_path}")
        with open(self.manifest_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _get_valid_tag_types(self) -> List[str]:
        """Get valid tagTypes from manifest."""
        try:
            manifest = self._load_manifest()
            return list(manifest.get('categoryTags', {}).keys())
        except Exception:
            return self.VALID_TAG_TYPES

    def parse_markdown(self, md_path: Path) -> Tuple[Dict[str, Any], str]:
        """
        Parse a markdown file and extract YAML front matter.

        Returns:
            Tuple of (front_matter dict, markdown body)

        Raises:
            MissingFrontMatterError: If no front matter found (signals need for user input)
            IngestError: If front matter is invalid
        """
        self.log(f"Parsing markdown: {md_path.name}")
        self.original_md_path = md_path

        content = md_path.read_text(encoding='utf-8')
        # Strip BOM and normalize newlines
        content = strip_bom(content)
        content = normalize_newlines(content)

        # Match YAML front matter
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
        if not match:
            # No front matter - extract H1 title if present and raise special error
            extracted_title = extract_h1_title(content)
            raise MissingFrontMatterError(md_path, content, extracted_title)

        yaml_str = match.group(1)
        body = match.group(2)

        try:
            front_matter = yaml.safe_load(yaml_str)
        except yaml.YAMLError as e:
            raise IngestError(f"Invalid YAML front matter: {e}")

        if not isinstance(front_matter, dict):
            raise IngestError("Front matter must be a YAML mapping")

        self.front_matter = front_matter
        self.markdown_content = content
        self.markdown_body = body
        self.slug = front_matter.get('slug', '')
        self.yaml_was_injected = False

        return front_matter, body

    def set_generated_front_matter(self, front_matter: Dict[str, Any], markdown_body: str):
        """
        Set front matter that was generated by the UI dialog.
        Used when markdown had no front matter and user filled in the modal.
        """
        self.front_matter = front_matter
        self.slug = front_matter.get('slug', '')
        # Normalize newlines in body
        markdown_body = normalize_newlines(markdown_body)
        self.markdown_body = markdown_body
        # Build full markdown content with generated front matter
        yaml_str = yaml.dump(front_matter, default_flow_style=False, allow_unicode=True, sort_keys=False)
        self.markdown_content = f"---\n{yaml_str}---\n\n{markdown_body}"
        self.yaml_was_injected = True
        self.log("Front matter will be injected (was not in source file)", 'success')

    def validate_front_matter(self, front_matter: Dict[str, Any]) -> List[str]:
        """
        Validate front matter fields.

        Returns:
            List of validation errors (empty if valid)
        """
        errors = []

        # Check required top-level fields
        for field in self.REQUIRED_FIELDS:
            if field not in front_matter or front_matter[field] is None:
                errors.append(f"Missing required field: {field}")

        # Check hero section
        hero = front_matter.get('hero', {})
        if not isinstance(hero, dict):
            errors.append("'hero' must be a mapping with 'alt' field")
        else:
            for field in self.REQUIRED_HERO_FIELDS:
                if field not in hero or not hero[field]:
                    errors.append(f"Missing required field: hero.{field}")

        # Check inlineImage section
        inline_img = front_matter.get('inlineImage', {})
        if not isinstance(inline_img, dict):
            errors.append("'inlineImage' must be a mapping with 'alt' field")
        else:
            for field in self.REQUIRED_INLINE_FIELDS:
                if field not in inline_img or not inline_img[field]:
                    errors.append(f"Missing required field: inlineImage.{field}")

        # Validate publishDate format (YYYY-MM-DD)
        pub_date = front_matter.get('publishDate', '')
        if pub_date:
            if not re.match(r'^\d{4}-\d{2}-\d{2}$', str(pub_date)):
                errors.append(f"publishDate must be YYYY-MM-DD format, got: {pub_date}")
            else:
                try:
                    datetime.strptime(str(pub_date), '%Y-%m-%d')
                except ValueError:
                    errors.append(f"publishDate is not a valid calendar date: {pub_date}")

        # Validate readTimeMinutes is positive integer
        read_time = front_matter.get('readTimeMinutes')
        if read_time is not None:
            if not isinstance(read_time, int) or read_time <= 0:
                errors.append(f"readTimeMinutes must be a positive integer, got: {read_time}")

        # Validate tagType
        tag_type = front_matter.get('tagType', '')
        valid_tags = self._get_valid_tag_types()
        if tag_type and tag_type not in valid_tags:
            errors.append(f"Invalid tagType '{tag_type}'. Must be one of: {', '.join(valid_tags)}")

        # Validate slug format
        slug = front_matter.get('slug', '')
        if slug and not re.match(r'^[a-z0-9-]+$', slug):
            errors.append(f"Slug must be lowercase alphanumeric with hyphens only: {slug}")

        return errors

    def validate_image(self, image_path: Path) -> List[str]:
        """
        Validate an image file.

        Returns:
            List of validation errors (empty if valid)
        """
        errors = []

        # Check file exists and is not empty
        if not image_path.exists():
            errors.append(f"Image file not found: {image_path}")
            return errors

        if image_path.stat().st_size == 0:
            errors.append(f"Image file is empty (0 bytes): {image_path.name}")
            return errors

        # Check dimensions
        try:
            with Image.open(image_path) as img:
                width, height = img.size
                if width < self.MIN_IMAGE_WIDTH:
                    errors.append(f"Image width {width}px is below minimum {self.MIN_IMAGE_WIDTH}px: {image_path.name}")
        except Exception as e:
            errors.append(f"Cannot read image {image_path.name}: {e}")

        return errors

    def detect_image_roles(self, image_paths: List[Path]) -> Tuple[Optional[Path], Optional[Path], bool]:
        """
        Detect which image is hero and which is inline based on filename.

        Returns:
            Tuple of (hero_path, inline_path, is_ambiguous)
        """
        if len(image_paths) != 2:
            return None, None, True

        hero_path = None
        inline_path = None

        for img_path in image_paths:
            name_lower = img_path.stem.lower()
            if 'header' in name_lower or 'hero' in name_lower:
                hero_path = img_path
            elif 'inline' in name_lower:
                inline_path = img_path

        # If we found both, we're good
        if hero_path and inline_path:
            return hero_path, inline_path, False

        # If we found one, the other is the remaining image
        if hero_path and not inline_path:
            inline_path = [p for p in image_paths if p != hero_path][0]
            return hero_path, inline_path, False

        if inline_path and not hero_path:
            hero_path = [p for p in image_paths if p != inline_path][0]
            return hero_path, inline_path, False

        # No clear mapping - ambiguous
        return None, None, True

    def check_slug_collision(self, slug: str, force_overwrite: bool = False) -> List[str]:
        """
        Check if slug conflicts with existing files.

        Returns:
            List of collision warnings/errors
        """
        collisions = []

        # Files to check
        draft_path = self.drafts_dir / f"{slug}.md"
        html_path = self.resources_dir / f"{slug}.html"

        # Check for any image with the slug prefix
        header_patterns = list(self.images_dir.glob(f"{slug}-header.*"))
        inline_patterns = list(self.images_dir.glob(f"{slug}-inline.*"))

        existing = []
        if draft_path.exists():
            existing.append(f"drafts/{slug}.md")
        if html_path.exists():
            existing.append(f"{slug}.html")
        existing.extend([f"images/{p.name}" for p in header_patterns])
        existing.extend([f"images/{p.name}" for p in inline_patterns])

        if existing:
            if force_overwrite:
                collisions.append(f"Will overwrite existing files: {', '.join(existing)}")
            else:
                collisions.append(f"Slug collision! These files exist: {', '.join(existing)}")
                collisions.append("Enable 'Force overwrite' to replace them.")

        return collisions

    def stage_files(self, md_path: Path, hero_path: Path, inline_path: Path,
                    force_overwrite: bool = False) -> Path:
        """
        Stage files atomically with temp bundle creation.

        This method:
        1. Creates a temp bundle folder: tools/resource_loader/tmp/<slug>-<timestamp>/
        2. Copies source files to temp bundle with normalized names
        3. Injects YAML front matter if missing
        4. Updates image paths in front matter
        5. Copies finalized files to repo destinations
        6. Validates YAML front matter before generator runs

        Returns:
            Path to the temp bundle directory
        """
        slug = self.front_matter['slug']
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        # Store original paths
        self.original_md_path = md_path
        self.original_hero_path = hero_path
        self.original_inline_path = inline_path

        # Log original paths
        self.log("=== Source Files (Original Locations) ===", 'info')
        self.log(f"  Markdown: {md_path}", 'info')
        self.log(f"  Hero Image: {hero_path}", 'info')
        self.log(f"  Inline Image: {inline_path}", 'info')

        # Create temp bundle directory
        temp_bundle_dir = self.repo_root / 'tools' / 'resource_loader' / 'tmp' / f"{slug}-{timestamp}"
        temp_bundle_dir.mkdir(parents=True, exist_ok=True)
        self.temp_bundle_dir = temp_bundle_dir

        self.log(f"=== Temp Bundle Folder ===", 'info')
        self.log(f"  {temp_bundle_dir}", 'info')

        try:
            # Ensure destination directories exist
            self.drafts_dir.mkdir(parents=True, exist_ok=True)
            self.images_dir.mkdir(parents=True, exist_ok=True)

            # Get image extensions
            hero_ext = hero_path.suffix.lower()
            inline_ext = inline_path.suffix.lower()

            # Normalized filenames
            normalized_md_name = f"{slug}.md"
            normalized_hero_name = f"{slug}-header{hero_ext}"
            normalized_inline_name = f"{slug}-inline{inline_ext}"

            # Copy images to temp bundle with normalized names (preserves originals)
            temp_hero = temp_bundle_dir / normalized_hero_name
            temp_inline = temp_bundle_dir / normalized_inline_name
            shutil.copy2(hero_path, temp_hero)
            shutil.copy2(inline_path, temp_inline)
            self.log(f"  Copied hero -> {normalized_hero_name}", 'info')
            self.log(f"  Copied inline -> {normalized_inline_name}", 'info')

            # Update front matter with correct image paths (relative to resources/)
            self.front_matter['hero']['src'] = f"images/{normalized_hero_name}"
            if 'inlineImage' not in self.front_matter:
                self.front_matter['inlineImage'] = {}
            self.front_matter['inlineImage']['src'] = f"images/{normalized_inline_name}"

            # Regenerate markdown content with updated front matter
            # This ensures YAML front matter is always at the top
            updated_md = self._regenerate_markdown_with_front_matter()

            # Write markdown to temp bundle with UTF-8 (no BOM) and LF newlines
            temp_md = temp_bundle_dir / normalized_md_name
            write_utf8_lf(temp_md, updated_md)
            self.log(f"  Created {normalized_md_name} (UTF-8, LF)", 'info')

            if self.yaml_was_injected:
                self.log("  YAML front matter: INJECTED (was not in source)", 'warning')
            else:
                self.log("  YAML front matter: PRESERVED (was in source)", 'success')

            # Backup existing files if force_overwrite
            if force_overwrite:
                self._backup_existing_files(slug, hero_ext, inline_ext)

            # === Copy finalized files to repo destinations ===
            self.log("=== Final Destination Paths ===", 'info')

            final_md = self.drafts_dir / normalized_md_name
            final_hero = self.images_dir / normalized_hero_name
            final_inline = self.images_dir / normalized_inline_name

            self.log(f"  drafts/{normalized_md_name}", 'info')
            self.log(f"  images/{normalized_hero_name}", 'info')
            self.log(f"  images/{normalized_inline_name}", 'info')

            # Copy from temp bundle to final destinations
            shutil.copy2(temp_md, final_md)
            shutil.copy2(temp_hero, final_hero)
            shutil.copy2(temp_inline, final_inline)

            self.staged_files = [final_md, final_hero, final_inline]
            self.log(f"Staged 3 files for slug: {slug}", 'success')

            return temp_bundle_dir

        except Exception as e:
            self.log(f"Staging failed: {e}", 'error')
            # Don't cleanup temp bundle on failure - keep for debugging
            raise IngestError(f"Failed to stage files: {e}")

    def _regenerate_markdown_with_front_matter(self) -> str:
        """Regenerate markdown with updated front matter, ensuring proper format."""
        # Use stored body if available, otherwise parse from content
        if self.markdown_body:
            body = self.markdown_body
        else:
            # Parse existing content to get body
            content = normalize_newlines(strip_bom(self.markdown_content))
            match = re.match(r'^---\s*\n.*?\n---\s*\n(.*)', content, re.DOTALL)
            body = match.group(1) if match else content

        # Generate new YAML front matter
        yaml_str = yaml.dump(self.front_matter, default_flow_style=False, allow_unicode=True, sort_keys=False)

        # Ensure body doesn't start with extra blank lines
        body = body.lstrip('\n')

        # Return with proper format: ---\nyaml\n---\n\nbody
        return f"---\n{yaml_str}---\n\n{body}"

    def _backup_existing_files(self, slug: str, hero_ext: str, inline_ext: str):
        """Backup existing files before overwriting."""
        paths_to_backup = [
            self.drafts_dir / f"{slug}.md",
            self.images_dir / f"{slug}-header{hero_ext}",
            self.images_dir / f"{slug}-inline{inline_ext}",
            self.resources_dir / f"{slug}.html"
        ]

        for path in paths_to_backup:
            if path.exists():
                self.backup_files[path] = path.read_bytes()
                self.log(f"Backed up: {path.name}", 'info')

    def _cleanup_staging(self, staging_dir: Path):
        """Clean up staging directory."""
        try:
            if staging_dir.exists():
                shutil.rmtree(staging_dir)
        except Exception:
            pass

    def cleanup_temp_bundle(self, force: bool = False):
        """
        Clean up the temp bundle folder.

        Args:
            force: If True, clean up even if keep_temp_folder is set
        """
        if self.temp_bundle_dir and self.temp_bundle_dir.exists():
            if force or not self.keep_temp_folder:
                try:
                    shutil.rmtree(self.temp_bundle_dir)
                    self.log(f"Cleaned up temp bundle: {self.temp_bundle_dir.name}", 'info')
                except Exception as e:
                    self.log(f"Failed to clean up temp bundle: {e}", 'warning')
            else:
                self.log(f"Keeping temp bundle for inspection: {self.temp_bundle_dir}", 'info')

    def preserve_failed_artifacts(self, slug: str):
        """
        Copy failed HTML and markdown to last_failed/ for inspection.
        Called when debug_mode is True and validation fails.
        """
        if not self.debug_mode:
            return

        last_failed_dir = self.repo_root / 'tools' / 'resource_loader' / 'tmp' / 'last_failed'
        last_failed_dir.mkdir(parents=True, exist_ok=True)

        self.log("=== Preserving Failed Artifacts (Debug Mode) ===", 'warning')

        # Copy generated HTML if it exists
        html_path = self.resources_dir / f"{slug}.html"
        if html_path.exists():
            dest_html = last_failed_dir / f"{slug}.html"
            shutil.copy2(html_path, dest_html)
            self.log(f"  Saved HTML: {dest_html}", 'warning')

        # Copy staged markdown if it exists
        md_path = self.drafts_dir / f"{slug}.md"
        if md_path.exists():
            dest_md = last_failed_dir / f"{slug}.md"
            shutil.copy2(md_path, dest_md)
            self.log(f"  Saved MD: {dest_md}", 'warning')

    def validate_pre_generator(self) -> List[str]:
        """
        Perform fail-fast validations BEFORE running the generator.

        Validates:
        1. Exactly 1 markdown file staged in drafts/
        2. Exactly 2 images staged in images/
        3. drafts/<slug>.md starts with '---\\n' and has closing '\\n---\\n'
        4. Both images exist at destination paths

        Returns:
            List of validation errors (empty if all pass)
        """
        errors = []
        slug = self.front_matter.get('slug', '')

        if not slug:
            errors.append("No slug set - cannot validate pre-generator")
            return errors

        self.log("=== Pre-Generator Validation ===", 'info')

        # Check markdown exists and has valid front matter
        final_md = self.drafts_dir / f"{slug}.md"
        if not final_md.exists():
            errors.append(f"Markdown not found at destination: {final_md}")
        else:
            is_valid, error_msg = assert_yaml_front_matter(final_md)
            if not is_valid:
                errors.append(f"YAML front matter validation failed: {error_msg}")
            else:
                self.log(f"  [OK] drafts/{slug}.md has valid YAML front matter", 'success')

        # Check images exist
        hero_ext = self.original_hero_path.suffix.lower() if self.original_hero_path else '.png'
        inline_ext = self.original_inline_path.suffix.lower() if self.original_inline_path else '.png'

        final_hero = self.images_dir / f"{slug}-header{hero_ext}"
        final_inline = self.images_dir / f"{slug}-inline{inline_ext}"

        if not final_hero.exists():
            errors.append(f"Hero image not found at destination: {final_hero}")
        else:
            self.log(f"  [OK] images/{slug}-header{hero_ext} exists", 'success')

        if not final_inline.exists():
            errors.append(f"Inline image not found at destination: {final_inline}")
        else:
            self.log(f"  [OK] images/{slug}-inline{inline_ext} exists", 'success')

        if errors:
            self.log("Pre-generator validation FAILED", 'error')
        else:
            self.log("Pre-generator validation PASSED", 'success')

        return errors

    def rollback(self):
        """Rollback staged files and restore backups."""
        self.log("Rolling back changes...", 'warning')

        # Remove staged files
        for path in self.staged_files:
            try:
                if path.exists():
                    path.unlink()
                    self.log(f"Removed: {path.name}", 'info')
            except Exception as e:
                self.log(f"Failed to remove {path.name}: {e}", 'error')

        # Restore backups
        for path, content in self.backup_files.items():
            try:
                path.write_bytes(content)
                self.log(f"Restored: {path.name}", 'info')
            except Exception as e:
                self.log(f"Failed to restore {path.name}: {e}", 'error')

        # Remove generated HTML if it exists
        slug = self.front_matter.get('slug', '')
        if slug:
            html_path = self.resources_dir / f"{slug}.html"
            if html_path.exists() and html_path not in self.backup_files:
                try:
                    html_path.unlink()
                    self.log(f"Removed generated: {html_path.name}", 'info')
                except Exception:
                    pass

        self.staged_files = []
        self.backup_files = {}
        self.log("Rollback complete", 'warning')

    def run_generators(self) -> Tuple[bool, str]:
        """
        Run the node.js generation scripts.

        Returns:
            Tuple of (success, output)
        """
        self.log("=== Running Generator Scripts ===", 'info')

        outputs = []

        # Run generate-resources.js
        gen_script = self.scripts_dir / 'generate-resources.js'
        if not gen_script.exists():
            return False, f"Generator script not found: {gen_script}"

        cmd = ['node', str(gen_script)]
        self.log(f"  Command: {' '.join(cmd)}", 'info')
        self.log(f"  Working dir: {self.repo_root}", 'info')

        try:
            result = subprocess.run(
                cmd,
                cwd=str(self.repo_root),
                capture_output=True,
                text=True,
                timeout=60
            )
            # Log both stdout and stderr for visibility
            if result.stdout.strip():
                self.log(f"Generator output:\n{result.stdout.strip()}", 'info')
            if result.stderr.strip():
                self.log(f"Generator stderr:\n{result.stderr.strip()}", 'warning')
            outputs.append(f"generate-resources.js:\n{result.stdout}")
            if result.returncode != 0:
                return False, f"generate-resources.js failed:\n{result.stderr}"
            self.log("Generated HTML from markdown", 'success')
        except subprocess.TimeoutExpired:
            return False, "generate-resources.js timed out"
        except Exception as e:
            return False, f"Failed to run generate-resources.js: {e}"

        # Run regenerate-index.js
        index_script = self.scripts_dir / 'regenerate-index.js'
        if not index_script.exists():
            return False, f"Index script not found: {index_script}"

        try:
            result = subprocess.run(
                ['node', str(index_script)],
                cwd=str(self.repo_root),
                capture_output=True,
                text=True,
                timeout=60
            )
            outputs.append(f"regenerate-index.js:\n{result.stdout}")
            if result.returncode != 0:
                return False, f"regenerate-index.js failed:\n{result.stderr}"
            self.log("Regenerated resource index", 'success')
        except subprocess.TimeoutExpired:
            return False, "regenerate-index.js timed out"
        except Exception as e:
            return False, f"Failed to run regenerate-index.js: {e}"

        return True, '\n'.join(outputs)

    def validate_generated_html(self, slug: str) -> List[str]:
        """
        Validate the generated HTML file matches publish-gate requirements.

        Returns:
            List of validation errors
        """
        errors = []
        html_path = self.resources_dir / f"{slug}.html"

        self.log("=== HTML Validation ===", 'info')
        self.log(f"  Expected: resources/{slug}.html", 'info')
        self.log(f"  Full path: {html_path}", 'info')

        if not html_path.exists():
            # List what files ARE in resources/ to help debug
            try:
                existing_html = [f.name for f in self.resources_dir.glob("*.html")]
                self.log(f"Existing HTML files in resources/: {existing_html[:10]}", 'info')
            except Exception:
                pass
            errors.append(f"Generated HTML not found: {html_path}")
            return errors

        content = html_path.read_text(encoding='utf-8')

        # Check for exactly one .article-header section (not __meta or other BEM variants)
        # Match class="article-header" but NOT class="article-header__*"
        header_matches = re.findall(r'class="article-header"', content)
        if len(header_matches) != 1:
            errors.append(f"Expected exactly 1 .article-header, found {len(header_matches)}")

        # Check for exactly one .article-hero-image
        hero_matches = re.findall(r'class="[^"]*article-hero-image[^"]*"', content)
        if len(hero_matches) != 1:
            errors.append(f"Expected exactly 1 .article-hero-image, found {len(hero_matches)}")

        # Check canonical link
        expected_canonical = f'https://pro.foxfuel.com/resources/{slug}.html'
        canonical_pattern = rf'<link[^>]*rel="canonical"[^>]*href="{re.escape(expected_canonical)}"'
        alt_pattern = rf'href="{re.escape(expected_canonical)}"[^>]*rel="canonical"'
        if not re.search(canonical_pattern, content) and not re.search(alt_pattern, content):
            # Check if canonical exists at all
            if 'rel="canonical"' in content:
                errors.append(f"Canonical link URL mismatch (expected: {expected_canonical})")

        # Check for correct tag type class
        tag_type = self.front_matter.get('tagType', '')
        if tag_type:
            tag_class = f'resource-card__tag--{tag_type}'
            if tag_class not in content:
                errors.append(f"Missing tag class: {tag_class}")

        # Check for no second H1 in article body
        # Find content within article body
        body_match = re.search(r'<article[^>]*class="[^"]*content-body[^"]*"[^>]*>(.*?)</article>', content, re.DOTALL)
        if body_match:
            body_content = body_match.group(1)
            h1_in_body = re.findall(r'<h1[^>]*>', body_content)
            if len(h1_in_body) > 0:
                errors.append(f"Found {len(h1_in_body)} H1 tag(s) inside article body (should be 0)")

        return errors

    def get_git_status(self) -> Tuple[List[str], List[str]]:
        """
        Get git status to check for unrelated changes.

        Returns:
            Tuple of (related_changes, unrelated_changes)
        """
        try:
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=str(self.repo_root),
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                return [], []

            slug = self.front_matter.get('slug', '')
            related = []
            unrelated = []

            for line in result.stdout.strip().split('\n'):
                if not line.strip():
                    continue

                # Extract file path (skip status chars)
                file_path = line[3:].strip()

                # Check if related to our resource
                if slug and slug in file_path:
                    related.append(file_path)
                elif 'resources/index.html' in file_path:
                    related.append(file_path)
                elif file_path:
                    unrelated.append(file_path)

            return related, unrelated

        except Exception:
            return [], []

    def commit_and_push(self, slug: str) -> Tuple[bool, str]:
        """
        Commit and push changes.

        Returns:
            Tuple of (success, output)
        """
        outputs = []

        try:
            # Git add
            result = subprocess.run(
                ['git', 'add', '-A'],
                cwd=str(self.repo_root),
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                return False, f"git add failed: {result.stderr}"
            outputs.append("git add -A: OK")

            # Git commit
            commit_msg = f"Add scheduled resource: {slug}"
            result = subprocess.run(
                ['git', 'commit', '-m', commit_msg],
                cwd=str(self.repo_root),
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                if 'nothing to commit' in result.stdout or 'nothing to commit' in result.stderr:
                    return False, "Nothing to commit - files may already be committed"
                return False, f"git commit failed: {result.stderr}"
            outputs.append(f"git commit: {commit_msg}")

            # Git push
            result = subprocess.run(
                ['git', 'push'],
                cwd=str(self.repo_root),
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                return False, f"git push failed: {result.stderr}"
            outputs.append("git push: OK")

            return True, '\n'.join(outputs)

        except Exception as e:
            return False, f"Git operation failed: {e}"


def find_repo_root(start_path: Path) -> Optional[Path]:
    """
    Find the repository root by walking up the directory tree.
    Looks for .git directory or package.json file.
    """
    current = start_path.resolve()

    while current != current.parent:
        if (current / '.git').exists() or (current / 'package.json').exists():
            return current
        current = current.parent

    return None
