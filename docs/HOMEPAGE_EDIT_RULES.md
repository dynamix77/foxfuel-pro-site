# Homepage Edit Rules for Seth

**Purpose:** This document defines exactly what content Seth can safely edit on the homepage (`index.html`) without breaking the layout or functionality.

---

## ✅ SAFE TO EDIT (Text Content Only)

You can freely edit the following text content within sections marked with `<!-- SAFE TO EDIT TEXT ONLY -->` comments:

### Headlines & Titles
- **H1 tags** (`<h1>`) - Main hero headline
- **H2 tags** (`<h2>`) - Section titles
- **H3 tags** (`<h3>`) - Card titles, step titles

### Paragraphs & Descriptions
- **Paragraph tags** (`<p>`) - All paragraph text, subheadlines, section introductions
- **Text inside list items** (`<li>`) - Bullet point text

### Button & Link Text
- **Button text** - Text inside `<a>` tags with button classes (e.g., "Request a Site Assessment")
- **Link text** - Text inside link tags (e.g., "View Solutions", "View Program")

### Trust Metrics & Numbers
- **Numbers** - Trust metric numbers (e.g., "43+", "24/7", "PA, NJ, DE")
- **Labels** - Trust metric labels (e.g., "Years in Business", "Emergency Availability")

---

## ❌ DO NOT EDIT (Structure & Code)

**Never edit these elements** - they control layout, styling, and functionality:

### HTML Structure
- **Class names** - Any `class="..."` attributes (e.g., `class="hero-home"`, `class="who-we-serve-card"`)
- **Container divs** - Wrapper elements like `<div class="container">`, `<div class="hero-grid">`
- **Grid containers** - Elements with grid classes (e.g., `class="who-we-serve-grid"`, `class="core-programs-grid"`)
- **Section tags** - The `<section>` elements and their class attributes

### Button & Link Structure
- **Button classes** - `class="btn btn-primary"`, `class="btn btn-secondary"`, `class="btn-large"`
- **Link classes** - `class="who-we-serve-link"`, `class="core-program-link"`
- **Link href attributes** - The `href="..."` URLs (only edit the visible link text)

### Image Elements
- **Image tags** - `<img>` elements and their attributes
- **Image wrappers** - `<div class="hero-image">`, `<div class="fuelcube-spotlight-image">`
- **Image paths** - `src="..."` attributes
- **Alt text** - `alt="..."` attributes (these can be edited, but be careful not to break the tag)

### Step Numbers
- **Step number divs** - `<div class="how-it-works-number">1</div>` (the number "1" can be changed, but not the class)

---

## 📍 How to Find Safe Edit Zones

Look for HTML comments in the code:

```html
<!-- SAFE TO EDIT TEXT ONLY: [description of what's safe] -->
[Content you can edit]
<!-- END SAFE TO EDIT TEXT ONLY -->
```

Everything between these comments is safe to edit. Everything outside these zones should not be touched.

---

## 🎯 Section-by-Section Guide

### Hero Section (`.hero-home`)
**Safe to edit:**
- H1 headline text
- Subheadline paragraph text
- Trust metric numbers and labels
- Button text ("Request a Site Assessment", "Talk to a Fuel Specialist")

**Do not edit:**
- `class="hero-home"`, `class="hero-grid"`, `class="hero-content"`
- `class="hero-trust-row"`, `class="trust-metric"`
- `class="hero-cta-group"`, `class="btn btn-primary btn-large"`
- Image wrapper and image tag

### Who We Serve Section (`.who-we-serve`)
**Safe to edit:**
- H2 section title
- Section intro paragraph
- H3 card titles
- Card description paragraphs
- Link text ("View Solutions")

**Do not edit:**
- `class="who-we-serve"`, `class="who-we-serve-grid"`, `class="who-we-serve-card"`
- `class="who-we-serve-link"`
- `href` attributes on links

### Core Programs Section (`.core-programs`)
**Safe to edit:**
- H2 section title
- Section intro paragraph
- H3 card titles
- Card description paragraphs
- Link text ("View Program")

**Do not edit:**
- `class="core-programs"`, `class="core-programs-grid"`, `class="core-program-card"`
- `class="core-program-link"`
- `href` attributes on links

### FuelCube Spotlight Section (`.fuelcube-spotlight`)
**Safe to edit:**
- H2 headline
- Bullet point text (inside `<li>` tags)
- Button text ("View FuelCube Options")

**Do not edit:**
- `class="fuelcube-spotlight"`, `class="fuelcube-spotlight-grid"`
- `class="fuelcube-spotlight-content"`, `class="fuelcube-spotlight-bullets"`
- `class="fuelcube-spotlight-cta"`, `class="btn btn-primary"`
- Image wrapper and image tag

### Why Fox Fuel Section (`.why-fox-fuel`)
**Safe to edit:**
- H2 section title
- Section intro paragraph
- H3 card titles
- Card description paragraphs

**Do not edit:**
- `class="why-fox-fuel"`, `class="why-fox-fuel-grid"`, `class="why-fox-fuel-card"`

### How It Works Section (`.how-it-works`)
**Safe to edit:**
- H2 section title
- Section intro paragraph
- H3 step titles
- Step description paragraphs
- Step numbers (the text "1", "2", "3", "4" inside the number div)

**Do not edit:**
- `class="how-it-works"`, `class="how-it-works-steps"`, `class="how-it-works-step"`
- `class="how-it-works-number"` (the class itself, not the number inside)

### Final CTA Section (`.final-cta`)
**Safe to edit:**
- H2 headline
- Button text ("Request a Site Assessment", "Talk to a Fuel Specialist")

**Do not edit:**
- `class="final-cta"`, `class="final-cta-content"`, `class="final-cta-buttons"`
- `class="btn btn-primary btn-large"`, `class="btn btn-secondary btn-large"`
- `href` attributes on buttons

---

## ⚠️ Important Warnings

1. **Never delete HTML tags** - Only edit the text content inside tags
2. **Never change class names** - Class names control styling and layout
3. **Never remove wrapper divs** - These are required for the grid layouts
4. **Never edit CSS files** - All styling is in `assets/css/pages/home.css` (do not touch)
5. **Never edit the header or footer** - These are site-wide components

---

## 🔍 Example: Safe Edit

**BEFORE:**
```html
<h3>Construction</h3>
<p>Eliminate equipment downtime with on-site fuel storage and reliable jobsite delivery for construction projects.</p>
```

**AFTER (Safe):**
```html
<h3>Construction & Excavation</h3>
<p>Eliminate equipment downtime with on-site fuel storage and reliable jobsite delivery for construction and excavation projects.</p>
```

---

## 🚫 Example: Unsafe Edit

**BEFORE:**
```html
<article class="who-we-serve-card">
  <h3>Construction</h3>
```

**AFTER (Unsafe - breaks layout):**
```html
<article class="industry-card">
  <h3>Construction</h3>
```

**Why it's unsafe:** Changing `class="who-we-serve-card"` to `class="industry-card"` breaks the CSS styling and grid layout.

---

## 📞 Need Help?

If you're unsure whether something is safe to edit:
1. Check if it's between `<!-- SAFE TO EDIT TEXT ONLY -->` comments
2. If it's a class name, href, or wrapper div - **don't edit it**
3. If it's just text content (headlines, paragraphs, button text) - **safe to edit**

When in doubt, ask before editing structural elements.

