# Resource Publishing System

This document explains how to add, schedule, and publish resource content for the Fox Fuel Pro site.

## Overview

The publishing system allows you to:
- Stage future resource posts months in advance
- Have them publish automatically on the correct date with ZERO manual work
- Maintain CI validation to prevent broken pages from shipping

## How It Works

1. **Front Matter-Driven**: New content uses YAML front matter in Markdown files
2. **Date-Based Publishing**: Resources with `publishDate` in the future won't appear on the index
3. **Daily Automation**: A GitHub Actions cron job runs daily to publish scheduled content
4. **CI Validation**: Every push validates manifest, front matter, HTML, and images

---

## Content Bundle Approach

Each new resource is a self-contained "content bundle" consisting of:

1. **One Markdown file** with YAML front matter (`resources/drafts/{slug}.md`)
2. **Two images** in the images folder:
   - Hero image: `resources/images/{slug}-header.png`
   - Inline image: `resources/images/{slug}-inline.png`

---

## Adding a New Scheduled Post

### Step 1: Create the Markdown Content

Create a new file in `resources/drafts/` with the slug as the filename:

```
resources/drafts/your-post-slug.md
```

### Step 2: Add YAML Front Matter

Add the following front matter at the top of your Markdown file:

```yaml
---
slug: "your-post-slug"
title: "Full Title of Your Resource"
shortTitle: "Short Title"
description: "Brief description for cards and meta tags."
category: "Fleet Operations"
tagType: "fleet"
publishDate: "2026-03-15"
readTimeMinutes: 10
hero:
  src: "images/your-post-slug-header.png"
  alt: "Descriptive alt text for hero image"
inlineImage:
  src: "images/your-post-slug-inline.png"
  alt: "Descriptive alt text for inline image"
  insertAfter: "## Section Heading Where Image Appears"
---
```

### Step 3: Write the Content

After the front matter, write your Markdown content:

```markdown
---
slug: "example-post"
title: "Example Post Title"
...
---

# Example Post Title

**Subtitle or tagline goes here.**

*January 15, 2026 | Reading time: 10 minutes*

---

## First Section

Your content here...

## Section Heading Where Image Appears

Content after this heading will have the inline image inserted before it.

More content...
```

**Markdown Format:**
- First H1 (`#`) becomes the page title (in article header, not body)
- Body headings start at H2 (`##`)
- Use standard Markdown: lists, tables, blockquotes, bold, italic
- Tables automatically get `class="comparison-table"` styling

### Step 4: Add Images

Place images in `resources/images/` using these naming conventions:
- **Hero image**: `{slug}-header.png`
- **Inline image**: `{slug}-inline.png`

Images can be added before publishDate - they'll be validated but won't break the build.

### Step 5: Generate the HTML

Run the generator script:
```bash
node scripts/generate-resources.js
```

This creates `resources/{slug}.html` from your Markdown.

### Step 6: Commit and Push

```bash
git add -A
git commit -m "Add scheduled resource: {slug} (publishes {date})"
git push
```

The CI will validate your changes.

---

## YAML Front Matter Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-safe identifier (must match filename) |
| `title` | string | Full title for H1 and meta |
| `shortTitle` | string | Short title for breadcrumb |
| `description` | string | Meta description and card text |
| `category` | string | Display label (e.g., "Fleet Operations") |
| `tagType` | string | CSS class suffix (see valid values below) |
| `publishDate` | string | YYYY-MM-DD format, America/New_York timezone |
| `readTimeMinutes` | number | Integer reading time |
| `hero.src` | string | Path to hero image (relative to resources/) |
| `hero.alt` | string | Hero image alt text |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `inlineImage.src` | string | Path to inline image |
| `inlineImage.alt` | string | Inline image alt text |
| `inlineImage.insertAfter` | string | Heading text to insert image after |

### Valid Tag Types

These map to CSS classes in `resources.manifest.json`:

| tagType | Label | CSS Class |
|---------|-------|-----------|
| `fleet` | Fleet Operations | `resource-card__tag--fleet` |
| `construction` | Construction | `resource-card__tag--construction` |
| `critical` | Critical Facilities | `resource-card__tag--critical` |
| `decision` | Decision Guide | `resource-card__tag--decision` |
| `healthcare` | Healthcare | `resource-card__tag--healthcare` |
| `manufacturing` | Manufacturing | `resource-card__tag--manufacturing` |

---

## Legacy Manifest Resources

The 4 originally published resources are still defined in `resources/resources.manifest.json`. These don't need front matter - they're fully generated HTML files.

New content should use the front matter approach in the `drafts/` folder.

---

## publishDate Behavior

- **Timezone**: All dates are evaluated in America/New_York
- **Comparison**: Resources appear when `publishDate <= today`
- **Automation**: Daily cron runs at 6:10 AM ET to regenerate index

### Example Timeline

If you add a resource with `publishDate: "2026-03-15"`:
- Before 2026-03-15: Resource exists in drafts but isn't visible on index
- On 2026-03-15 at 6:10 AM ET: Cron job generates HTML, regenerates index, commits
- After: Resource appears on index permanently

---

## Daily Publishing Workflow

The GitHub Actions workflow (`.github/workflows/daily-publish.yml`) runs daily:

1. **Schedule**: 6:10 AM America/New_York (UTC adjusted for DST)
2. **Check**: Reads drafts folder for resources with `publishDate == today`
3. **Generate**: If new resources, runs `generate-resources.js` and `regenerate-index.js`
4. **Commit**: If changes detected, commits and pushes

### Manual Trigger

You can trigger publishing manually:
```
GitHub → Actions → Daily Resource Publisher → Run workflow
```

---

## Publish-Gate CI Validation

Every push to `main` runs validation (`.github/workflows/publish-gate.yml`):

### Manifest Validation (Legacy Resources)
- All required fields present
- Valid `publishDate` format (YYYY-MM-DD)
- Valid `tagType`

### Drafts Validation (New Content)
- YAML front matter present
- All required fields in front matter
- Valid `publishDate` format
- Valid `tagType` (matches values in manifest)
- Filename matches slug
- Hero section with src and alt

### HTML Validation
For each generated HTML file:
- Exactly one `.article-header` element
- Correct canonical link URL
- Correct resource tag class

### Image Validation
- Warns if referenced images don't exist (non-blocking)
- Images can be added before publishDate

### Failure Remediation

If CI fails:
1. Check the workflow output for specific errors
2. Fix the identified issues
3. Push again

---

## Image Naming Rules

### Hero Images
- Location: `resources/images/`
- Naming: `{slug}-header.png`
- Example: `winter-generator-fuel-failures-header.png`

### Inline Images
- Location: `resources/images/`
- Naming: `{slug}-inline.png`
- Example: `winter-generator-fuel-failures-inline.png`

---

## File Structure

```
foxfuel-pro-site/
├── resources/
│   ├── resources.manifest.json    # Tag definitions + legacy resources
│   ├── index.html                 # Auto-regenerated index page
│   ├── TEMPLATE-resource-single.html
│   ├── README-publishing.md       # This file
│   ├── drafts/                    # Markdown with front matter
│   │   ├── winter-generator-fuel-failures.md
│   │   ├── annual-fuel-review-checklist.md
│   │   ├── spring-construction-mobile-fueling.md
│   │   ├── summer-fleet-fuel-optimization.md
│   │   └── industrial-fuel-planning-guide.md
│   ├── images/                    # All resource images
│   │   ├── {slug}-header.png
│   │   ├── {slug}-inline.png
│   │   └── ...
│   └── *.html                     # Generated resource pages
├── scripts/
│   ├── generate-resources.js      # MD → HTML generator
│   └── regenerate-index.js        # Index updater
└── .github/
    └── workflows/
        ├── daily-publish.yml      # Daily cron publisher
        └── publish-gate.yml       # CI validation
```

---

## Resource Loader Utility (Recommended)

The easiest way to add new resources is the **Fox Fuel Resource Loader** GUI utility.

### Quick Start (5 Steps)

1. **Prepare your content bundle**:
   - One `.md` file with YAML front matter
   - Two images (hero + inline, any filenames)

2. **Launch the Resource Loader**:
   ```powershell
   # Option A: Run Python script
   python tools/resource_loader/resource_loader.py

   # Option B: Double-click the exe (after building)
   tools\resource_loader\dist\FoxFuelResourceLoader.exe
   ```

3. **Drop files** into the app (or click Browse)

4. **Click "Process"** to validate, stage, and generate

5. **Click "Commit + Push"** to publish

### Building the Executable

```powershell
cd tools\resource_loader
.\build_exe.ps1
```

Creates `dist\FoxFuelResourceLoader.exe` - a single double-clickable Windows app.

### What the Utility Does

- Validates front matter (required fields, tagType, date format)
- Validates images (minimum 1024px width, not empty)
- Detects image roles from filenames (or prompts you to select)
- Renames files to `{slug}-header.*` and `{slug}-inline.*`
- Stages files atomically with rollback on failure
- Runs `generate-resources.js` and `regenerate-index.js`
- Validates generated HTML matches publish-gate requirements
- Commits with proper message and pushes

See `tools/resource_loader/README.md` for full documentation.

---

## Quick Reference (Manual Method)

### Add a new scheduled post:
```bash
# 1. Create markdown with front matter in resources/drafts/{slug}.md
# 2. Add images to resources/images/
# 3. Generate HTML
node scripts/generate-resources.js
# 4. Commit and push
git add -A && git commit -m "Add scheduled: slug (publishes date)" && git push
```

### Test locally:
```bash
# Regenerate index for today's date
node scripts/regenerate-index.js
# Open in browser to verify
```

### Force publish now:
```bash
# Change publishDate to today or earlier in front matter
# Regenerate and push
node scripts/generate-resources.js
node scripts/regenerate-index.js
git add -A && git commit -m "Publish: slug" && git push
```

---

## Scheduled Content (Future Publish Dates)

Current drafts waiting to publish:

| Slug | Publish Date | Category |
|------|--------------|----------|
| winter-generator-fuel-failures | 2026-01-06 | Critical Facilities |
| annual-fuel-review-checklist | 2026-01-15 | Decision Guide |
| spring-construction-mobile-fueling | 2026-03-03 | Construction |
| summer-fleet-fuel-optimization | 2026-06-03 | Fleet Operations |
| industrial-fuel-planning-guide | 2026-09-02 | Manufacturing |

---

## Troubleshooting

### Resource not appearing on index
- Check `publishDate` is <= today (America/New_York)
- Run `node scripts/regenerate-index.js`
- Verify front matter is correct

### CI validation failing
- Read the error message carefully
- Common issues: missing fields, invalid tagType, wrong date format
- Ensure filename matches slug

### Images not loading
- Check path in front matter matches actual file location
- Ensure images are in `resources/images/`
- Use relative paths: `images/filename.png`

### HTML not generating
- Ensure markdown file is in `drafts/` folder
- Check YAML front matter syntax (proper indentation)
- Run generator with verbose output

---

## Notes

- The system uses America/New_York timezone for all date comparisons
- Kinsta deployment is triggered by any commit to main
- Future posts exist in the repo but aren't linked until publishDate
- The daily cron only commits if there are actual changes
- Legacy manifest resources are fully published; new content uses front matter
