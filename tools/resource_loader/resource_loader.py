"""
Fox Fuel Resource Loader - GUI Application

A desktop utility for loading resource content bundles:
- Drag and drop 1 markdown + 2 images
- Parse and validate front matter
- Stage files atomically
- Run generation scripts
- Commit and push to git
"""

import os
import sys
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, simpledialog
from pathlib import Path
from typing import List, Optional, Tuple
import threading

# Try to import tkinterdnd2 for drag-and-drop support
try:
    from tkinterdnd2 import DND_FILES, TkinterDnD
    HAS_DND = True
except ImportError:
    HAS_DND = False

from ingest_pipeline import IngestPipeline, IngestError, MissingFrontMatterError, find_repo_root, slugify
from datetime import datetime


class ImageRoleDialog(tk.Toplevel):
    """Dialog to select which image is hero vs inline."""

    def __init__(self, parent, image1: Path, image2: Path):
        super().__init__(parent)
        self.title("Select Image Roles")
        self.result = None

        self.transient(parent)
        self.grab_set()

        # Center on parent
        self.geometry("400x200")

        # Message
        msg = tk.Label(self, text="Cannot determine image roles from filenames.\nPlease select which image is the Hero (header) image:",
                       wraplength=350, justify='left')
        msg.pack(pady=20)

        # Selection
        self.selection = tk.StringVar(value=str(image1))

        frame = ttk.Frame(self)
        frame.pack(fill='x', padx=20)

        ttk.Radiobutton(frame, text=image1.name, variable=self.selection,
                        value=str(image1)).pack(anchor='w')
        ttk.Radiobutton(frame, text=image2.name, variable=self.selection,
                        value=str(image2)).pack(anchor='w')

        # Buttons
        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=20)

        ttk.Button(btn_frame, text="OK", command=self._ok).pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Cancel", command=self._cancel).pack(side='left', padx=5)

        self.image1 = image1
        self.image2 = image2

        self.protocol("WM_DELETE_WINDOW", self._cancel)
        self.wait_window()

    def _ok(self):
        selected = Path(self.selection.get())
        if selected == self.image1:
            self.result = (self.image1, self.image2)
        else:
            self.result = (self.image2, self.image1)
        self.destroy()

    def _cancel(self):
        self.result = None
        self.destroy()


class CommitConfirmDialog(tk.Toplevel):
    """Dialog to confirm commit with summary."""

    def __init__(self, parent, slug: str, related_files: List[str], unrelated_files: List[str],
                 allow_unrelated: bool = False):
        super().__init__(parent)
        self.title("Confirm Commit & Push")
        self.result = False
        self.has_unrelated = len(unrelated_files) > 0
        self.allow_unrelated = allow_unrelated

        self.transient(parent)
        self.grab_set()

        self.geometry("500x450")

        # Summary
        summary = f"Ready to commit resource: {slug}\n\n"
        summary += "Files to commit:\n"
        for f in related_files[:10]:
            summary += f"  + {f}\n"
        if len(related_files) > 10:
            summary += f"  ... and {len(related_files) - 10} more\n"

        if unrelated_files:
            summary += f"\nWARNING: {len(unrelated_files)} unrelated changed files:\n"
            for f in unrelated_files[:5]:
                summary += f"  ? {f}\n"
            if len(unrelated_files) > 5:
                summary += f"  ... and {len(unrelated_files) - 5} more\n"
            if allow_unrelated:
                summary += "\nThese will also be committed!"
            else:
                summary += "\nCommit BLOCKED: Enable 'Allow committing unrelated changes' to proceed."

        text = tk.Text(self, wrap='word', height=15)
        text.pack(fill='both', expand=True, padx=10, pady=10)
        text.insert('1.0', summary)
        text.config(state='disabled')

        # Buttons
        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=10)

        # Disable commit button if unrelated changes exist and not allowed
        commit_state = 'normal'
        if self.has_unrelated and not self.allow_unrelated:
            commit_state = 'disabled'

        self.commit_btn = ttk.Button(btn_frame, text="Commit & Push", command=self._confirm, state=commit_state)
        self.commit_btn.pack(side='left', padx=5)
        ttk.Button(btn_frame, text="Cancel", command=self._cancel).pack(side='left', padx=5)

        self.protocol("WM_DELETE_WINDOW", self._cancel)
        self.wait_window()

    def _confirm(self):
        self.result = True
        self.destroy()

    def _cancel(self):
        self.result = False
        self.destroy()


class FrontMatterDialog(tk.Toplevel):
    """Dialog to create front matter when markdown has none."""

    # Category options
    CATEGORIES = [
        "Construction",
        "Fleet Operations",
        "Critical Facilities",
        "Decision Guide",
        "Manufacturing",
        "Healthcare"
    ]

    # Category to tagType mapping
    CATEGORY_TO_TAG = {
        "Construction": "construction",
        "Fleet Operations": "fleet",
        "Critical Facilities": "critical",
        "Decision Guide": "decision",
        "Manufacturing": "manufacturing",
        "Healthcare": "healthcare"
    }

    def __init__(self, parent, extracted_title: Optional[str] = None, valid_tag_types: List[str] = None):
        super().__init__(parent)
        self.title("Create Front Matter")
        self.result = None  # Will hold the generated front matter dict
        self.valid_tag_types = valid_tag_types or list(self.CATEGORY_TO_TAG.values())

        self.transient(parent)
        self.grab_set()

        self.geometry("550x550")
        self.resizable(True, True)

        # Header message
        msg = tk.Label(self, text="No YAML front matter found.\nFill this out once and the tool will generate it automatically.",
                       wraplength=500, justify='left', font=('Segoe UI', 10))
        msg.pack(pady=(15, 10), padx=15)

        # Form frame
        form_frame = ttk.Frame(self, padding=10)
        form_frame.pack(fill='both', expand=True, padx=10)

        row = 0

        # Title
        ttk.Label(form_frame, text="Title *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        self.title_var = tk.StringVar(value=extracted_title or "")
        self.title_entry = ttk.Entry(form_frame, textvariable=self.title_var, width=50)
        self.title_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        self.title_var.trace_add('write', self._on_title_change)
        row += 1

        # Slug (auto-generated, editable)
        ttk.Label(form_frame, text="Slug *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        self.slug_var = tk.StringVar(value=slugify(extracted_title) if extracted_title else "")
        self.slug_entry = ttk.Entry(form_frame, textvariable=self.slug_var, width=50)
        self.slug_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Short Title
        ttk.Label(form_frame, text="Short Title *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        short_default = (extracted_title[:40] + "...") if extracted_title and len(extracted_title) > 40 else (extracted_title or "")
        self.short_title_var = tk.StringVar(value=short_default)
        self.short_title_entry = ttk.Entry(form_frame, textvariable=self.short_title_var, width=50)
        self.short_title_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Description (multi-line)
        ttk.Label(form_frame, text="Description *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='ne', pady=3)
        self.desc_text = tk.Text(form_frame, width=50, height=3, wrap='word')
        self.desc_text.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Publish Date
        ttk.Label(form_frame, text="Publish Date *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        today_str = datetime.now().strftime('%Y-%m-%d')
        self.date_var = tk.StringVar(value=today_str)
        date_frame = ttk.Frame(form_frame)
        date_frame.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        self.date_entry = ttk.Entry(date_frame, textvariable=self.date_var, width=15)
        self.date_entry.pack(side='left')
        ttk.Label(date_frame, text="(YYYY-MM-DD)", font=('Segoe UI', 8)).pack(side='left', padx=5)
        row += 1

        # Read Time
        ttk.Label(form_frame, text="Read Time (min) *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        self.read_time_var = tk.StringVar(value="6")
        self.read_time_entry = ttk.Entry(form_frame, textvariable=self.read_time_var, width=10)
        self.read_time_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Category dropdown
        ttk.Label(form_frame, text="Category *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        self.category_var = tk.StringVar(value=self.CATEGORIES[0])
        self.category_combo = ttk.Combobox(form_frame, textvariable=self.category_var, values=self.CATEGORIES, state='readonly', width=25)
        self.category_combo.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        self.category_combo.bind('<<ComboboxSelected>>', self._on_category_change)
        row += 1

        # Tag Type dropdown
        ttk.Label(form_frame, text="Tag Type *", font=('Segoe UI', 9, 'bold')).grid(row=row, column=0, sticky='e', pady=3)
        self.tag_type_var = tk.StringVar(value=self.CATEGORY_TO_TAG.get(self.CATEGORIES[0], "fleet"))
        self.tag_type_combo = ttk.Combobox(form_frame, textvariable=self.tag_type_var, values=self.valid_tag_types, state='readonly', width=25)
        self.tag_type_combo.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Hero Alt (auto-filled)
        ttk.Label(form_frame, text="Hero Alt Text", font=('Segoe UI', 9)).grid(row=row, column=0, sticky='e', pady=3)
        self.hero_alt_var = tk.StringVar(value=f"Operational fueling activity supporting {self.category_var.get()} operations")
        self.hero_alt_entry = ttk.Entry(form_frame, textvariable=self.hero_alt_var, width=50)
        self.hero_alt_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Inline Alt (auto-filled)
        ttk.Label(form_frame, text="Inline Alt Text", font=('Segoe UI', 9)).grid(row=row, column=0, sticky='e', pady=3)
        self.inline_alt_var = tk.StringVar(value="Fuel planning documentation and on-site operational review")
        self.inline_alt_entry = ttk.Entry(form_frame, textvariable=self.inline_alt_var, width=50)
        self.inline_alt_entry.grid(row=row, column=1, sticky='w', pady=3, padx=5)
        row += 1

        # Error label
        self.error_label = tk.Label(self, text="", fg='red', wraplength=500)
        self.error_label.pack(pady=5)

        # Buttons
        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=15)

        ttk.Button(btn_frame, text="Save & Continue", command=self._save).pack(side='left', padx=10)
        ttk.Button(btn_frame, text="Cancel", command=self._cancel).pack(side='left', padx=10)

        self.protocol("WM_DELETE_WINDOW", self._cancel)

        # Focus title entry
        self.title_entry.focus_set()

        self.wait_window()

    def _on_title_change(self, *args):
        """Auto-update slug and short title when title changes."""
        title = self.title_var.get()
        self.slug_var.set(slugify(title))
        if len(title) > 40:
            self.short_title_var.set(title[:40] + "...")
        else:
            self.short_title_var.set(title)

    def _on_category_change(self, event=None):
        """Auto-update tag type and hero alt when category changes."""
        category = self.category_var.get()
        tag_type = self.CATEGORY_TO_TAG.get(category, "fleet")
        self.tag_type_var.set(tag_type)
        self.hero_alt_var.set(f"Operational fueling activity supporting {category} operations")

    def _validate(self) -> List[str]:
        """Validate form inputs."""
        errors = []

        if not self.title_var.get().strip():
            errors.append("Title is required")

        slug = self.slug_var.get().strip()
        if not slug:
            errors.append("Slug is required")
        elif not all(c.isalnum() or c == '-' for c in slug) or slug != slug.lower():
            errors.append("Slug must be lowercase alphanumeric with hyphens only")

        if not self.short_title_var.get().strip():
            errors.append("Short title is required")

        if not self.desc_text.get('1.0', 'end').strip():
            errors.append("Description is required")

        # Validate date
        date_str = self.date_var.get().strip()
        if not date_str:
            errors.append("Publish date is required")
        else:
            try:
                datetime.strptime(date_str, '%Y-%m-%d')
            except ValueError:
                errors.append("Publish date must be valid YYYY-MM-DD format")

        # Validate read time
        try:
            read_time = int(self.read_time_var.get())
            if read_time <= 0:
                errors.append("Read time must be a positive integer")
        except ValueError:
            errors.append("Read time must be a positive integer")

        if not self.hero_alt_var.get().strip():
            errors.append("Hero alt text is required")

        if not self.inline_alt_var.get().strip():
            errors.append("Inline alt text is required")

        return errors

    def _save(self):
        """Validate and save the front matter."""
        errors = self._validate()
        if errors:
            self.error_label.config(text="\n".join(errors))
            return

        # Build front matter dict
        self.result = {
            'title': self.title_var.get().strip(),
            'shortTitle': self.short_title_var.get().strip(),
            'description': self.desc_text.get('1.0', 'end').strip(),
            'slug': self.slug_var.get().strip(),
            'publishDate': self.date_var.get().strip(),
            'readTimeMinutes': int(self.read_time_var.get()),
            'category': self.category_var.get(),
            'tagType': self.tag_type_var.get(),
            'hero': {
                'alt': self.hero_alt_var.get().strip()
                # src will be added by stage_files
            },
            'inlineImage': {
                'alt': self.inline_alt_var.get().strip()
                # src will be added by stage_files
            }
        }

        self.destroy()

    def _cancel(self):
        """Cancel and close dialog."""
        self.result = None
        self.destroy()


class ResourceLoaderApp:
    """Main application window."""

    def __init__(self, root):
        self.root = root
        self.root.title("Fox Fuel Resource Loader")
        self.root.geometry("700x700")
        self.root.minsize(600, 600)

        # Find repo root
        self.repo_root = self._find_repo_root()
        if not self.repo_root:
            messagebox.showerror("Error", "Could not find repository root.\nMake sure this tool is inside the foxfuel-pro-site repo.")
            sys.exit(1)

        # Initialize pipeline
        self.pipeline = IngestPipeline(self.repo_root, log_callback=self._log)

        # State
        self.md_file: Optional[Path] = None
        self.image_files: List[Path] = []
        self.hero_image: Optional[Path] = None
        self.inline_image: Optional[Path] = None
        self.process_complete = False

        # Build UI
        self._build_ui()

        # Update state
        self._update_ui_state()

    def _find_repo_root(self) -> Optional[Path]:
        """Find the repository root."""
        # Start from the script location or current directory
        if getattr(sys, 'frozen', False):
            # Running as compiled exe
            start = Path(sys.executable).parent
        else:
            start = Path(__file__).parent

        return find_repo_root(start)

    def _build_ui(self):
        """Build the user interface."""
        # Main container
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill='both', expand=True)

        # Header
        header = ttk.Label(main_frame, text="Fox Fuel Resource Loader",
                          font=('Segoe UI', 14, 'bold'))
        header.pack(pady=(0, 10))

        repo_label = ttk.Label(main_frame, text=f"Repo: {self.repo_root}",
                               font=('Segoe UI', 9))
        repo_label.pack(pady=(0, 10))

        # Drop zone
        self._build_drop_zone(main_frame)

        # File list
        self._build_file_list(main_frame)

        # Front matter display
        self._build_front_matter_display(main_frame)

        # Options
        self._build_options(main_frame)

        # Buttons
        self._build_buttons(main_frame)

        # Log panel
        self._build_log_panel(main_frame)

    def _build_drop_zone(self, parent):
        """Build the drag-drop zone."""
        frame = ttk.LabelFrame(parent, text="Drop Files Here", padding=10)
        frame.pack(fill='x', pady=5)

        self.drop_zone = tk.Frame(frame, bg='#e0e0e0', height=80)
        self.drop_zone.pack(fill='x')

        drop_label = tk.Label(self.drop_zone,
                              text="Drag & drop 1 Markdown + 2 Images here\n(or use Browse button)",
                              bg='#e0e0e0', fg='#666')
        drop_label.pack(expand=True, fill='both', pady=20)

        # Enable drag-drop if available
        if HAS_DND:
            self.drop_zone.drop_target_register(DND_FILES)
            self.drop_zone.dnd_bind('<<Drop>>', self._on_drop)
            drop_label.drop_target_register(DND_FILES)
            drop_label.dnd_bind('<<Drop>>', self._on_drop)
        else:
            drop_label.config(text="Drag & drop not available.\nUse the Browse button to select files.")

        # Browse button
        browse_btn = ttk.Button(frame, text="Browse Files...", command=self._browse_files)
        browse_btn.pack(pady=5)

    def _build_file_list(self, parent):
        """Build the file list display."""
        frame = ttk.LabelFrame(parent, text="Loaded Files", padding=10)
        frame.pack(fill='x', pady=5)

        self.file_list = ttk.Treeview(frame, columns=('type', 'status'), height=3, show='headings')
        self.file_list.heading('type', text='Type')
        self.file_list.heading('status', text='Status')
        self.file_list.column('type', width=100)
        self.file_list.column('status', width=400)
        self.file_list.pack(fill='x')

    def _build_front_matter_display(self, parent):
        """Build the front matter display."""
        frame = ttk.LabelFrame(parent, text="Front Matter", padding=10)
        frame.pack(fill='x', pady=5)

        # Grid for front matter fields
        self.fm_labels = {}
        fields = ['slug', 'title', 'publishDate', 'tagType', 'readTimeMinutes']

        for i, field in enumerate(fields):
            label = ttk.Label(frame, text=f"{field}:", font=('Segoe UI', 9, 'bold'))
            label.grid(row=i, column=0, sticky='e', padx=5, pady=2)

            value = ttk.Label(frame, text="--", font=('Segoe UI', 9))
            value.grid(row=i, column=1, sticky='w', padx=5, pady=2)
            self.fm_labels[field] = value

    def _build_options(self, parent):
        """Build the options section."""
        frame = ttk.Frame(parent)
        frame.pack(fill='x', pady=5)

        # Row 1
        row1 = ttk.Frame(frame)
        row1.pack(fill='x')

        self.force_overwrite = tk.BooleanVar(value=False)
        ttk.Checkbutton(row1, text="Force overwrite if slug exists",
                        variable=self.force_overwrite).pack(side='left')

        self.allow_unrelated = tk.BooleanVar(value=False)
        ttk.Checkbutton(row1, text="Allow committing unrelated changes",
                        variable=self.allow_unrelated).pack(side='left', padx=10)

        # Row 2
        row2 = ttk.Frame(frame)
        row2.pack(fill='x', pady=(5, 0))

        self.keep_temp_folder = tk.BooleanVar(value=False)
        ttk.Checkbutton(row2, text="Keep temp folder (for debugging)",
                        variable=self.keep_temp_folder).pack(side='left')

        self.debug_mode = tk.BooleanVar(value=False)
        ttk.Checkbutton(row2, text="Debug mode",
                        variable=self.debug_mode).pack(side='left', padx=10)

    def _build_buttons(self, parent):
        """Build the action buttons."""
        frame = ttk.Frame(parent)
        frame.pack(fill='x', pady=10)

        self.process_btn = ttk.Button(frame, text="Process", command=self._process)
        self.process_btn.pack(side='left', padx=5)

        self.commit_btn = ttk.Button(frame, text="Commit + Push", command=self._commit_push)
        self.commit_btn.pack(side='left', padx=5)

        self.reset_btn = ttk.Button(frame, text="Reset", command=self._reset)
        self.reset_btn.pack(side='left', padx=5)

    def _build_log_panel(self, parent):
        """Build the log panel."""
        frame = ttk.LabelFrame(parent, text="Log", padding=5)
        frame.pack(fill='both', expand=True, pady=5)

        # Scrolled text
        self.log_text = tk.Text(frame, wrap='word', height=10, state='disabled',
                                font=('Consolas', 9))
        scrollbar = ttk.Scrollbar(frame, orient='vertical', command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)

        self.log_text.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

        # Configure tags for log levels
        self.log_text.tag_configure('info', foreground='black')
        self.log_text.tag_configure('success', foreground='green')
        self.log_text.tag_configure('warning', foreground='orange')
        self.log_text.tag_configure('error', foreground='red')

    def _log(self, message: str, level: str = 'info'):
        """Log a message to the log panel."""
        self.log_text.config(state='normal')

        # Add icon prefix
        icons = {'info': '', 'success': ' ', 'warning': ' ', 'error': ' '}
        icon = icons.get(level, '')

        self.log_text.insert('end', f"{icon}{message}\n", level)
        self.log_text.see('end')
        self.log_text.config(state='disabled')
        self.root.update_idletasks()

    def _update_ui_state(self):
        """Update UI state based on current loaded files."""
        # Clear file list
        for item in self.file_list.get_children():
            self.file_list.delete(item)

        # Add markdown
        if self.md_file:
            status = f"{self.md_file.name}"
            self.file_list.insert('', 'end', values=('Markdown', status))
        else:
            self.file_list.insert('', 'end', values=('Markdown', 'Not loaded'))

        # Add images
        if len(self.image_files) == 2:
            if self.hero_image and self.inline_image:
                self.file_list.insert('', 'end', values=('Hero Image', self.hero_image.name))
                self.file_list.insert('', 'end', values=('Inline Image', self.inline_image.name))
            else:
                for img in self.image_files:
                    self.file_list.insert('', 'end', values=('Image', img.name))
        elif len(self.image_files) == 1:
            self.file_list.insert('', 'end', values=('Image', self.image_files[0].name))
            self.file_list.insert('', 'end', values=('Image', 'Need 1 more'))
        else:
            self.file_list.insert('', 'end', values=('Images', 'Not loaded (need 2)'))

        # Update front matter display
        fm = self.pipeline.front_matter
        for field, label in self.fm_labels.items():
            if field in fm:
                label.config(text=str(fm[field]))
            else:
                label.config(text='--')

        # Update button states
        valid_files = (self.md_file is not None and
                       len(self.image_files) == 2 and
                       self.hero_image is not None and
                       self.inline_image is not None)

        self.process_btn.config(state='normal' if valid_files else 'disabled')
        self.commit_btn.config(state='normal' if self.process_complete else 'disabled')

    def _on_drop(self, event):
        """Handle drag-drop event."""
        # Parse dropped files
        files_str = event.data
        # Handle Windows paths with curly braces for paths with spaces
        if '{' in files_str:
            import re
            files = re.findall(r'\{([^}]+)\}|(\S+)', files_str)
            files = [f[0] or f[1] for f in files]
        else:
            files = files_str.split()

        self._load_files([Path(f) for f in files])

    def _browse_files(self):
        """Open file browser to select files."""
        files = filedialog.askopenfilenames(
            title="Select 1 Markdown + 2 Images",
            filetypes=[
                ("All supported", "*.md *.png *.jpg *.jpeg"),
                ("Markdown", "*.md"),
                ("Images", "*.png *.jpg *.jpeg")
            ]
        )

        if files:
            self._load_files([Path(f) for f in files])

    def _load_files(self, files: List[Path]):
        """Load and validate files from any location on disk."""
        if len(files) > 3:
            self._log("Error: Too many files. Please drop exactly 3 files (1 .md + 2 images).", 'error')
            return

        md_files = []
        img_files = []

        for f in files:
            ext = f.suffix.lower()
            if ext == '.md':
                md_files.append(f)
            elif ext in ['.png', '.jpg', '.jpeg']:
                img_files.append(f)
            else:
                self._log(f"Ignoring unsupported file type: {f.name}", 'warning')

        # Validate counts
        if len(md_files) > 1:
            self._log("Error: Only 1 markdown file allowed.", 'error')
            return

        if len(img_files) > 2:
            self._log("Error: Only 2 image files allowed.", 'error')
            return

        # Add to existing (allow incremental loading)
        if md_files:
            self.md_file = md_files[0]
            self._log(f"Loaded markdown: {self.md_file.name}", 'success')
            self._log(f"  Source path: {self.md_file}", 'info')

            # Parse front matter - handle missing front matter with dialog
            try:
                fm, _ = self.pipeline.parse_markdown(self.md_file)
                self._log(f"Parsed front matter for slug: {fm.get('slug', 'unknown')}", 'info')
                self._log("  YAML front matter: present in source file", 'success')
            except MissingFrontMatterError as e:
                # No front matter - show dialog to create it
                self._log("No YAML front matter found in source file", 'warning')
                self._log("Launching front matter generator dialog...", 'info')
                valid_tags = self.pipeline._get_valid_tag_types()
                dialog = FrontMatterDialog(self.root, extracted_title=e.extracted_title, valid_tag_types=valid_tags)
                if dialog.result:
                    # User filled in the form - set generated front matter
                    self.pipeline.set_generated_front_matter(dialog.result, e.body)
                    self._log(f"Front matter created for slug: {dialog.result.get('slug', 'unknown')}", 'success')
                    self._log("  YAML will be injected when processing", 'info')
                else:
                    # User cancelled
                    self._log("Front matter creation cancelled", 'warning')
                    self.md_file = None
            except IngestError as e:
                self._log(f"Error parsing markdown: {e}", 'error')

        for img in img_files:
            if len(self.image_files) < 2 and img not in self.image_files:
                self.image_files.append(img)
                self._log(f"Loaded image: {img.name}", 'success')
                self._log(f"  Source path: {img}", 'info')

        # Try to detect image roles
        if len(self.image_files) == 2:
            hero, inline, ambiguous = self.pipeline.detect_image_roles(self.image_files)

            if ambiguous:
                # Show dialog
                dialog = ImageRoleDialog(self.root, self.image_files[0], self.image_files[1])
                if dialog.result:
                    self.hero_image, self.inline_image = dialog.result
                    self._log(f"Hero image: {self.hero_image.name}", 'info')
                    self._log(f"Inline image: {self.inline_image.name}", 'info')
                else:
                    self._log("Image role selection cancelled", 'warning')
                    self.hero_image = None
                    self.inline_image = None
            else:
                self.hero_image = hero
                self.inline_image = inline
                self._log(f"Detected hero image: {self.hero_image.name}", 'info')
                self._log(f"Detected inline image: {self.inline_image.name}", 'info')

        self._update_ui_state()

    def _process(self):
        """Run the processing pipeline."""
        self._log("\n========================================", 'info')
        self._log("        Starting Process", 'info')
        self._log("========================================", 'info')

        # Reset process state
        self.process_complete = False

        # Set flags on pipeline
        self.pipeline.keep_temp_folder = self.keep_temp_folder.get()
        self.pipeline.debug_mode = self.debug_mode.get()

        # Validate front matter
        self._log("Validating front matter...", 'info')
        errors = self.pipeline.validate_front_matter(self.pipeline.front_matter)
        if errors:
            for err in errors:
                self._log(err, 'error')
            return

        self._log("Front matter validation passed", 'success')

        # Validate images
        self._log("Validating images...", 'info')
        for img in [self.hero_image, self.inline_image]:
            errors = self.pipeline.validate_image(img)
            if errors:
                for err in errors:
                    self._log(err, 'error')
                return

        self._log("Image validation passed", 'success')

        # Check slug collision
        slug = self.pipeline.front_matter['slug']
        self._log(f"Checking for slug collision: {slug}", 'info')
        collisions = self.pipeline.check_slug_collision(slug, self.force_overwrite.get())
        if collisions:
            for msg in collisions:
                if 'Will overwrite' in msg:
                    self._log(msg, 'warning')
                else:
                    self._log(msg, 'error')
                    return

        # Stage files (creates temp bundle and copies to destinations)
        try:
            temp_bundle_dir = self.pipeline.stage_files(
                self.md_file,
                self.hero_image,
                self.inline_image,
                self.force_overwrite.get()
            )
        except IngestError as e:
            self._log(str(e), 'error')
            return

        # Pre-generator validation (fail-fast before running generator)
        pre_errors = self.pipeline.validate_pre_generator()
        if pre_errors:
            for err in pre_errors:
                self._log(err, 'error')
            self._log("Keeping temp bundle for debugging: " + str(temp_bundle_dir), 'warning')
            # Do NOT rollback or clean temp - keep for debugging
            return

        # Run generators
        success, output = self.pipeline.run_generators()
        if not success:
            self._log(output, 'error')
            self._log("Generator failed - keeping temp bundle for debugging", 'warning')
            # Do NOT rollback on generator failure - keep files for inspection
            return

        if self.debug_mode.get():
            self._log(output, 'info')

        # Validate generated HTML
        errors = self.pipeline.validate_generated_html(slug)
        if errors:
            for err in errors:
                self._log(err, 'error')
            self._log("HTML validation FAILED", 'error')
            # Preserve artifacts BEFORE any cleanup (debug mode only)
            self.pipeline.preserve_failed_artifacts(slug)
            self._log("Keeping temp bundle for debugging: " + str(temp_bundle_dir), 'warning')
            # Do NOT rollback - keep staged files for debugging
            return

        self._log("HTML validation PASSED", 'success')

        # Clean up temp bundle (respects keep_temp_folder setting)
        self.pipeline.cleanup_temp_bundle()

        self._log("", 'info')
        self._log("========================================", 'success')
        self._log(f"  Process complete for: {slug}", 'success')
        self._log("  Ready to Commit + Push", 'success')
        self._log("========================================", 'success')

        self.process_complete = True
        self._update_ui_state()

    def _commit_push(self):
        """Commit and push changes."""
        if not self.process_complete:
            self._log("Process must complete successfully before committing.", 'error')
            return

        slug = self.pipeline.front_matter.get('slug', 'unknown')

        # Get git status
        related, unrelated = self.pipeline.get_git_status()

        # Show confirmation dialog with allow_unrelated flag
        dialog = CommitConfirmDialog(self.root, slug, related, unrelated,
                                     allow_unrelated=self.allow_unrelated.get())
        if not dialog.result:
            self._log("Commit cancelled by user", 'warning')
            return

        self._log("\n--- Committing Changes ---", 'info')

        success, output = self.pipeline.commit_and_push(slug)

        if success:
            self._log(output, 'info')
            self._log(f"\nSuccessfully committed and pushed: {slug}", 'success')
        else:
            self._log(output, 'error')

    def _reset(self):
        """Reset all state."""
        self.md_file = None
        self.image_files = []
        self.hero_image = None
        self.inline_image = None
        self.process_complete = False

        # Reset pipeline
        self.pipeline = IngestPipeline(self.repo_root, log_callback=self._log)

        # Clear log
        self.log_text.config(state='normal')
        self.log_text.delete('1.0', 'end')
        self.log_text.config(state='disabled')

        self._log("Reset complete. Ready for new files.", 'info')
        self._update_ui_state()


def main():
    """Main entry point."""
    # Use TkinterDnD if available, otherwise regular Tk
    if HAS_DND:
        root = TkinterDnD.Tk()
    else:
        root = tk.Tk()

    app = ResourceLoaderApp(root)
    root.mainloop()


if __name__ == '__main__':
    main()
