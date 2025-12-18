# Antigravity Redesign Master Specification for Fox Fuel

## 1. Purpose of This Specification
This Master Specification defines the authoritative design, structure, components, and behavior required for the complete Antigravity-driven redesign of **pro.foxfuel.com**. It ensures that every page, module, stylesheet, and UI element follows a unified visual and functional system.

This document is the **single source of truth** for the redesign.

---

## 2. Core Design Principles
### 2.1 Overall Aesthetic
The redesigned site must follow the enterprise-grade aesthetic demonstrated in the approved mockup:
- Clean, modern layouts
- Left-aligned headline hero sections with strong CTAs
- Generous white space and clear hierarchy
- Minimalist industrial design language
- Photography-forward visuals with contextual imagery

### 2.2 Tone & Voice
- Professional, industrial, B2B-focused
- Emphasis on reliability, safety, and operational excellence
- Language that supports enterprise-level perception

### 2.3 Brand Guidelines
- **Primary Red:** #C8102E
- **Industrial Slate / Navy:** #0A1931
- **Charcoal:** #333333
- **White:** #FFFFFF
- **Fonts:** Inter, SF Pro, or Roboto (system-safe fallback chain required)
- **Button Style:** Solid red primary CTAs, navy secondary CTAs
- **Icon Style:** Minimal line icons, monochrome or duotone

---

## 3. Global Layout System
### 3.1 Grid
- 12-column responsive grid
- 1200–1440px max width container
- Standard spacing units: 16px, 24px, 32px, 48px, 64px

### 3.2 Header
- Horizontal navigation bar
- Fox Fuel logo left
- Nav links right
- Dropdown for "Industries" using the updated structure
- Button: “Request a Quote” as the top-right CTA

### 3.3 Footer
- Three-column footer layout
- Contact information
- Services list
- Industries list
- Simplified branding bar at bottom

---

## 4. Core Page Templates
### 4.1 Homepage
**Sections required:**
1. Hero (headline left, image right, CTA)
2. Three-Service Grid (Bulk Fuel Delivery, Fleet Fueling, Jobsite Fueling)
3. FuelCube Highlight (split section, dark background)
4. Industries Grid (photo tiles with uppercase labels)
5. Testimonials or Trust Indicators (optional)
6. Final CTA Banner

### 4.2 Services Pages
Each service page must follow:
- Hero section with contextual imagery
- Service overview paragraph
- Feature list in a grid format
- Supporting imagery
- CTA module at bottom

### 4.3 FuelCube Program Pages
All FuelCube pages share a unified layout system:
- Hero with FuelCube or jobsite image
- Split sections (image left or right alternating)
- Specification grids
- CTA panels

### 4.4 Industries Pages
Industries landing page:
- 3-column grid of industry tiles
- Tiles must use actual photography
- Uppercase industry tags

Industry detail page:
- Hero + supporting copy
- Fueling challenges & solutions
- “Why Fox Fuel” panel
- CTA at bottom

---

## 5. Component Library (Mandatory)
The site must use a consistent component system:

### Buttons
- Primary: Red background (#C8102E), white text
- Secondary: Navy background (#0A1931), white text
- Hover states required

### Cards
- White background
- Rounded corners (4px)
- Slight shadow
- Icon + title + body text

### Photography Modules
- Right-side aligned in hero
- Full-bleed optional for subheaders

### Iconography
- Simple line icons
- Consistent stroke width
- Used for service grids and feature lists

---

## 6. CSS Architecture
### 6.1 Structure
Use a clean, scalable system:
- `/css/base.css` → resets, typography, spacing
- `/css/components.css` → cards, buttons, grids
- `/css/layout.css` → header, footer, containers
- `/css/pages/*.css` → page-specific overrides

### 6.2 Coding Standards
- BEM naming optional but consistency required
- Avoid inline styles
- Components must be reusable

---

## 7. HTML Standards
- Semantic HTML5 required
- `<main>`, `<header>`, `<footer>` usage mandatory
- No deprecated tags
- ARIA roles for dropdowns and navigation elements

---

## 8. Responsive Rules
### Mobile Behavior:
- Hero stacks with image under headline
- Three-service grid becomes single-column
- Industry grid becomes 1 column
- Navigation collapses to hamburger

### Tablet:
- 2-column industry grid
- Services remain two columns

---

## 9. Image Handling
Use descriptive placeholders such as:
- `hero-tech-operator.jpg`
- `industry-construction.jpg`
- `fuelcube-on-site.jpg`

Images should:
- Maintain consistent color grading (industrial/cinematic)
- Avoid cartoony or unrealistic AI artifacts

---

## 10. Content Preservation
Antigravity must NOT:
- Modify any URLs
- Remove any existing services or industries
- Change the naming structure

This redesign is purely visual and structural.

---

## 11. Output Requirements for Antigravity
Antigravity must:
- Refactor the entire codebase using this specification
- Apply the new layout system to ALL pages
- Regenerate homepage first, then services, FuelCube, and industries
- Rebuild header and footer globally
- Maintain SEO tags and metadata

---

## 12. Review & Approval Workflow
1. Generate redesigned homepage using this spec.
2. Await human review.
3. Proceed to services pages.
4. Proceed to FuelCube pages.
5. Finalize industries pages.

All output must strictly conform to this document.

