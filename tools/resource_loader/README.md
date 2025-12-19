# Fox Fuel Resource Loader

A Windows desktop utility for loading resource content bundles into the Fox Fuel Pro site.

## What It Does

1. **Accept files**: Drag-drop or browse for 1 Markdown + 2 images
2. **Validate**: Checks front matter, image dimensions, slug collisions
3. **Stage**: Renames and moves files to correct locations atomically
4. **Generate**: Runs `generate-resources.js` and `regenerate-index.js`
5. **Commit**: Commits and pushes to git with proper message

## Quick Start

### Option A: Run from Python (Development)

```powershell
cd tools\resource_loader
pip install -r requirements.txt
python resource_loader.py
```

### Option B: Build and Run Executable

```powershell
cd tools\resource_loader
.\build_exe.ps1
# Then double-click: dist\FoxFuelResourceLoader.exe
```

## Usage

1. **Prepare your content bundle**:
   - One `.md` file with YAML front matter
   - Two images: one for hero, one for inline

2. **Launch the app** (exe or `python resource_loader.py`)

3. **Drop files** into the drop zone (or click Browse)

4. **Select image roles** if filenames are ambiguous
   - Files containing "header" or "hero" are auto-detected as hero
   - Files containing "inline" are auto-detected as inline

5. **Click Process** to:
   - Validate all inputs
   - Stage files to correct locations
   - Run generation scripts
   - Validate generated HTML

6. **Click Commit + Push** to:
   - Review changes
   - Commit with message: "Add scheduled resource: {slug}"
   - Push to remote

## File Naming

**Input files** (your files):
- Any `.md` filename works
- Images work best with "header"/"hero" or "inline" in the name

**Output files** (after staging):
```
resources/drafts/{slug}.md
resources/images/{slug}-header.png
resources/images/{slug}-inline.png
resources/{slug}.html  (generated)
```

## Front Matter Requirements

Your Markdown must have YAML front matter with these fields:

```yaml
---
title: "Full Article Title"
description: "Meta description for SEO"
slug: "url-safe-slug"
publishDate: "2026-01-15"
readTimeMinutes: 8
category: "Fleet Operations"
tagType: "fleet"
hero:
  alt: "Description of hero image"
inlineImage:
  alt: "Description of inline image"
  insertAfter: "## Section Heading"
---
```

### Valid tagTypes

- `fleet` - Fleet Operations
- `construction` - Construction
- `critical` - Critical Facilities
- `healthcare` - Healthcare
- `decision` - Decision Guide
- `manufacturing` - Manufacturing

## Validation Checks

### Front Matter
- All required fields present
- `publishDate` is valid YYYY-MM-DD
- `readTimeMinutes` is positive integer
- `tagType` exists in manifest

### Images
- Not 0 bytes
- Minimum 1024px width

### Slug Collision
- Checks for existing files with same slug
- Requires "Force overwrite" checkbox to replace

### Generated HTML
- Exactly one `.article-header`
- Exactly one `.article-hero-image`
- Correct canonical link URL
- Correct tag type class
- No H1 in article body

## Options

- **Force overwrite**: Replace existing files with same slug
- **Debug mode**: Show verbose errors and script output

## Rollback

If any step fails after staging, the tool automatically:
1. Removes staged files
2. Restores any overwritten files from backup
3. Reports what was rolled back

## Dependencies

- Python 3.9+
- pyyaml (YAML parsing)
- Pillow (image validation)
- tkinterdnd2 (drag-drop, optional)
- pyinstaller (for building exe)
- Node.js (for generation scripts)
- Git (for commit/push)

## Building the Executable

```powershell
.\build_exe.ps1
```

Options:
- `-Clean`: Remove previous build artifacts first
- `-Debug`: Include debug symbols

Output: `dist\FoxFuelResourceLoader.exe`

The exe is self-contained and can be run from:
- Its original location: `tools\resource_loader\dist\`
- Copied anywhere inside the repo
- The repo root is detected by walking up to find `.git` or `package.json`

## Troubleshooting

### Drag-drop not working
- tkinterdnd2 may not install correctly on some systems
- Use the "Browse Files" button as fallback
- This is a known Windows/Tkinter limitation

### "Could not find repository root"
- Make sure the exe is inside the foxfuel-pro-site repo
- The tool looks for `.git` or `package.json` walking up directories

### Node scripts failing
- Ensure Node.js is installed and in PATH
- Run `node --version` to verify

### Git push failing
- Check you have push access to the repo
- Check for uncommitted changes that conflict
- Run `git status` manually to diagnose

## Files

```
tools/resource_loader/
├── resource_loader.py     # GUI application
├── ingest_pipeline.py     # Core logic
├── requirements.txt       # Python dependencies
├── build_exe.ps1          # Build script
├── README.md              # This file
├── tmp/                   # Staging directory (auto-created)
└── dist/
    └── FoxFuelResourceLoader.exe  # Built executable
```
