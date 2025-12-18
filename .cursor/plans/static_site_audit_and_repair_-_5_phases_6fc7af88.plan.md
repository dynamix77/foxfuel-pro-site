---
name: Static Site Audit and Repair - 5 Phases
overview: "Systematically audit and repair the Fox Fuel B2B static site across 5 phases: repo reconnaissance, asset audit, path fixes, consistency checks, and git cleanup. Each phase stops with a report before proceeding."
todos:
  - id: phase1-recon
    content: "Phase 1: Document site structure, identify core assets, check CSS path patterns, list obvious issues. Output summary report. NO EDITS."
    status: completed
  - id: phase2-audit
    content: "Phase 2: Scan all HTML/CSS for asset references, verify file existence, build lists of working/broken assets, propose fixes. Output markdown table. NO EDITS."
    status: completed
    dependencies:
      - phase1-recon
  - id: phase3-fixes
    content: "Phase 3: Fix /assets_renamed/ typos, fix logo references, fix missing images, fix CSS background-image paths, comment out non-critical broken assets. Output change summary."
    status: completed
    dependencies:
      - phase2-audit
  - id: phase4-consistency
    content: "Phase 4: Verify navigation/footer consistency across all pages, fix internal links, ensure CSS/JS includes match. Output consistency report."
    status: pending
    dependencies:
      - phase3-fixes
  - id: phase5-git
    content: "Phase 5: Verify .gitignore, stage changes, show git status/diff, propose commit message. WAIT for user approval before commit/push."
    status: pending
    dependencies:
      - phase4-consistency
---

# Static Site Audit and Repair Plan

## Phase 1: Repo Reconnaissance

**Objective:** Map the site structure and identify core assets without making changes.

**Actions:**

1. Document root files: `index.html`, `sitemap.xml`, `robots.txt`
2. Document folder structure: `assets/`, `services/`, `industries/`, `fuelcube/`
3. Identify CSS files:

- `assets/css/sitewide_styles_PRODUCTION.css`
- `assets/css/ui-elements.css`

4. Identify JS file: `assets/js/site_interactions_PRODUCTION.js`
5. Confirm image base: `assets/renamed/` with subfolders (branding, services, operations, jobsites, facilities, etc.)
6. Check CSS path patterns in `index.html` vs subpages:

- Root uses: `/assets/css/...` (absolute)
- Subpages use: `../assets/css/...` (relative)

7. Identify obvious issues:

- Found: `/assets_renamed/` typo in 3 HTML files (should be `/assets/renamed/`)

**Output:** Bullet summary of structure and initial findings. No file edits.

---

## Phase 2: Asset and Image Audit

**Objective:** Catalog all asset references and identify broken paths.

**Actions:**

1. Scan all HTML files for:

- `<link rel="stylesheet">` tags
- `<script src="">` tags
- `<img src="">` tags
- JSON-LD schema logo references

2. Scan CSS files for:

- `background-image: url(...)` references

3. For each unique asset path:

- Verify file exists in repo
- Check path correctness (absolute vs relative)

4. Build four lists:

- **A)** CSS files referenced and present
- **B)** JS files referenced and present
- **C)** Image/background URLs that exist
- **D)** Image/background URLs that DO NOT exist

5. For missing assets, propose fixes:

- Best-match replacement from `assets/renamed/`
- Or mark for removal/commenting if no match

**Special cases to flag:**

- `/assets_renamed/` → `/assets/renamed/` (already identified: 3 instances)
- Any `fox-fuel-logo.png` → `branding-fox-fuel-logo-main-01.png`
- Homepage hero image validation
- CSS background-image paths in `ui-elements.css` (17 found)

**Output:** Markdown table of broken references with suggested fixes. No file edits.

---

## Phase 3: Apply Fixes for Paths and Images

**Objective:** Fix all identified path and image issues.

**Actions:**

1. Fix path typos:

- Replace `/assets_renamed/` → `/assets/renamed/` in:
 - `index.html` (line 25)
 - `services/generator-fueling.html` (line 22)
 - `services/index.html` (line 25)

2. Fix logo references:

- Replace any `fox-fuel-logo.png` with `branding-fox-fuel-logo-main-01.png`

3. Fix missing images:

- Update HTML `<img>` tags with best-match files from `assets/renamed/`
- For homepage hero: ensure uses real file from `assets/renamed/composite/`

4. Fix CSS background images:

- Verify all `url()` paths in `ui-elements.css` point to existing files
- Update or comment out broken `background-image` rules

5. For non-critical missing assets:

- Comment out `<img>` tags or CSS rules rather than leaving broken
- Prefer commenting decorative elements over layout changes

**Output:**

- Bullet list of changes by file
- `git diff --stat` summary
- Confirmation no remaining broken paths

---

## Phase 4: Consistency Check - Navigation, Footer, CSS/JS

**Objective:** Ensure uniform structure across all pages.

**Actions:**

1. Verify every main page loads:

- Same navigation structure as `index.html`
- Same footer structure as `index.html`
- Both CSS files (`sitewide_styles_PRODUCTION.css` and `ui-elements.css`)
- JS file where appropriate

2. Check internal links:

- Navigation `<a href="">` point to existing HTML files
- Footer links point to real pages (or at least not typos)
- Fix broken `href` attributes

3. Fix objective issues only:

- Incorrect `href` pointing to non-existent files
- Pages missing CSS includes that other pages have
- Inconsistent navigation/footer markup

**Files to check:**

- `index.html` (baseline)
- `services/*.html` (5 files)
- `industries/*.html` (13 files)
- `fuelcube/*.html` (5 files)

**Output:**

- List of nav/footer/link changes made
- Confirmation styles and navigation are consistent

---

## Phase 5: Git Cleanup and Commit Prep

**Objective:** Prepare repo for deployment.

**Actions:**

1. Verify `.gitignore` excludes:

- `.cursorindexingignore`
- `.specstory/`
- Any `.cursor*` files
- Editor temp files

2. Stage only relevant changes:

- HTML files
- CSS files
- JS files (if changed)
- Image files under `assets/` that are actually used

3. Show status:

- `git status` output
- `git diff --stat` output

4. Propose commit message:

- Example: "Fix static site assets, image paths, and layout consistency"

**Important:** Wait for user confirmation before any `git commit` or `git push`.

**Output:**

- `git status` output
- `git diff --stat` output
- Proposed commit message
- **STOP and wait for approval**

---

## Key Files to Modify

- `index.html` - Fix `/assets_renamed/` typo
- `services/generator-fueling.html` - Fix `/assets_renamed/` typo
- `services/index.html` - Fix `/assets_renamed/` typo
- Additional HTML files as needed for consistency
- CSS files only if background-image paths need fixing

## Constraints

- Do NOT touch SEO copy, headings, or business content
- Do NOT change file/folder names under `assets/renamed/` unless absolutely required
- Do NOT commit Cursor artifacts
- Keep changes minimal and surgical
- Stop after each phase with clear report