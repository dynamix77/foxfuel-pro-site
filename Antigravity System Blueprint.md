# **✅ 1\. A Component Inventory (Required for 100 percent consistency)**

This is a list of EVERY UI element currently in the repo:

* Hero types

* Buttons (primary, secondary, outline, etc.)

* Cards

* Grids

* Icons

* Forms

* Navigation variants

* Footer blocks

* Banner CTAs

* FuelCube modules

* Services modules

* Industry tiles

* Pricing boxes

* Feature lists

Antigravity will REFACTOR these into reusable components.  
 Without the inventory, it may miss or duplicate patterns.

➡️ I can generate this automatically by scanning your repo structure.

---

# **✅ 2\. A Content Map (URL → Page Purpose → Required Sections)**

This ensures Antigravity understands:

* What each page should contain

* How each page should *feel*

* Which template applies

* Which sections should appear on each page

Example entry:

`/services/bulk-fuel-delivery.html`  
`- Template: Services Default`  
`- Sections: Hero, Overview, 3-Feature Grid, Industry Applications, CTA Panel`  
`- Notes: Must include FuelCube CTA on bottom.`

This prevents Antigravity from “guessing” content structure.

---

# **✅ 3\. Image Strategy Document (Brand Cohesive Photography Rules)**

Your spec tells HOW images fit.  
 But this document tells WHAT images must represent.

It covers:

* Style (cinematic, industrial, natural light)

* Workers (safety gear, branding)

* Environments (construction, jobsite, hospital, data center, marinas)

* FuelCube images

* Tanker truck images

* No AI weirdness rules

* No ambiguous or unsafe imagery

* Hose rules (only when delivering fuel)

This avoids mismatched image styles across pages.

---

# **✅ 4\. Navigation Hierarchy \+ Interaction Map**

This makes sure top navigation, dropdowns, and mobile menus are consistent.

Includes:

* Navbar structure

* Dropdown interactions

* Active state styling

* Mobile hamburger rules

* Link ordering

* Footer link hierarchy

This ensures the navigation *never drifts* between pages.

---

# **✅ 5\. A Tokenized Design System (Color, Spacing, Typography Tokens)**

Tokens ensure that spacing and colors are exact everywhere.

Example:

`--color-primary: #C8102E;`  
`--color-secondary: #0A1931;`  
`--color-text: #333333;`  
`--space-sm: 16px;`  
`--space-md: 24px;`  
`--space-lg: 48px;`  
`--radius-sm: 4px;`

This helps Antigravity generate clean, scalable CSS.

---

# **✅ 6\. A File \+ Folder Architecture Plan**

Nothing kills redesigns faster than sloppy folder structures.

We set:

* `/assets/img/hero/`

* `/assets/img/industries/`

* `/assets/img/fuelcube/`

* `/assets/css/base.css`

* `/assets/css/components.css`

* `/assets/css/layout.css`

* `/assets/js/global.js`

This stabilizes the repo long-term.

---

# **✅ 7\. Component Wireframes or Annotated Mockups**

Even simple wireframes ensure Antigravity knows:

* exact spacing

* exact layout

* exact proportions

We already produced one mockup.  
 We’ll need matching mockups for:

* Services page

* FuelCube highlight page

* Industries landing page

* Industry detail template

**I can generate all of these.**

---

# **✅ 8\. Migration Instructions for Existing HTML**

Antigravity needs to know how to treat:

* outdated inline styles

* old table-based layouts

* deep-nested divs

* repeated markup that should become components

This prevents broken layouts after the redesign.

---

# **🏗️ When combined, these create a full Design System:**

**Master Spec**

* **Component Inventory**

* **Content Map**

* **Image Strategy**

* **Navigation Map**

* **Design Tokens**

* **Folder Architecture**

* **Wireframes for core templates**

➡️ After these are assembled, Antigravity can rebuild your entire site *with total precision* and zero ambiguity.

---

# **🚀 I can now generate the missing components.**

Which one do you want next?

1. **Component Inventory**

2. **Content Map**

3. **Image Strategy**

4. **Navigation Map**

5. **Design Tokens**

6. **Folder Architecture Plan**

7. **Wireframes for Services / FuelCube / Industries**

Just tell me the number — or say **“Do everything.”**

##### **You said:**

do evberything

###### **ChatGPT said:**

Thought for 14s

**TL;DR**  
 I just built out everything you asked for:

* Component inventory

* Content map (per URL)

* Image strategy

* Navigation hierarchy

* Design tokens

* Folder / file architecture

* Wireframe specs for core templates

You can treat this as the “Antigravity System Blueprint” that sits next to your Master Spec.

---

## **1\. Component Inventory**

High level list of the reusable pieces Antigravity should standardize across all pages.

### **1.1 Global layout components**

* **Header / Top Nav**

  * Logo

  * Primary nav links

  * “Industries” dropdown

  * Primary CTA button (Request a Quote)

* **Footer**

  * Contact block

  * Services column

  * Industries column

  * Legal bar (copyright, privacy)

* **Page shell**

  * Constrained content container

  * Standard vertical spacing between sections

  * Background color variants (white, light gray, dark section)

### **1.2 Hero components**

* **Hero A: Standard**

  * Layout: text left, image right

  * Elements:

    * Eyebrow (optional)

    * H1 headline

    * Supporting paragraph

    * Primary CTA button

    * Secondary CTA link or button

    * Right aligned hero image (truck, FuelCube, facility)

* **Hero B: Dark band**

  * Same as Hero A but with dark background color and white text

  * Used for FuelCube and high urgency services (emergency or generator fueling)

### **1.3 Content and grid components**

* **Service card**

  * Icon

  * Title

  * Short description

  * Optional “Learn more” link

* **Feature grid**

  * Section title and intro text

  * 3 or 4 feature items

  * Each item:

    * Small icon

    * Short title

    * 1–2 line description

* **Stats strip (optional future)**

  * Three stats with label and value

  * Used on home or FuelCube pages for credibility

* **Two column text \+ image**

  * Text left, image right or alternated

  * Title, paragraph, bullet list, CTA

  * Used for FuelCube program sections, generator pages, etc.

### **1.4 Industries components**

* **Industries grid tile**

  * Background image

  * Uppercase industry label

  * Optional short subtitle

  * Clickable card linking to detail page

* **Industry detail content blocks**

  * “Challenges we solve” bullet list

  * “How we support this industry” bullet list or 2-column text

  * “Why Fox Fuel for this industry” checklist style block

  * CTA band at bottom

### **1.5 Conversion components**

* **CTA band**

  * Full width section

  * Short headline

  * One or two buttons

  * Neutral or dark background

* **Contact / quote form teaser**

  * For now: “Request a quote” button linking to existing form

  * Future version could embed an actual compact form

### **1.6 Utility components**

* Breadcrumb (optional future)

* Tag / chip labels (for industries, fuel types)

* Inline alerts or notices (for seasonal info, emergency messaging)

Antigravity should treat these as reusable building blocks, not one-off markup.

---

## **2\. Content Map (URL → Template → Sections)**

This is the routing table Antigravity should follow, instead of guessing.

### **2.1 Home**

| URL | Template | Required sections |
| ----- | ----- | ----- |
| `/` and `/index.html` | `Home` | Hero, 3-service grid, FuelCube highlight, Industries grid, optional trust strip, final CTA band |

### **2.2 Services**

| URL | Template | Required sections |
| ----- | ----- | ----- |
| `/services/index.html` | `Services Index` | Hero, service cards grid (all key services), FuelCube teaser, CTA band |
| `/services/bulk-fuel-delivery.html` | `Service Detail` | Hero, overview paragraph, feature grid, applicable industries strip, CTA band |
| `/services/fleet-fueling.html` | `Service Detail` | Hero, overview, feature grid, “How on-site fueling works” text \+ image, CTA band |
| `/services/jobsite-fueling.html` | `Service Detail` | Hero, overview, 3–4 feature blocks, “Ideal for” industry list, CTA band |
| `/services/generator-fueling.html` | `Service Detail` | Hero, emphasis on emergency/backup, feature grid, “Response time / availability” block, CTA band |
| `/services/monitoring-fuel-management.html` | `Service Detail` | Hero, overview, feature grid focused on telemetry, alerts, tank monitoring, CTA band |

### **2.3 FuelCube**

| URL | Template | Required sections |
| ----- | ----- | ----- |
| `/fuelcube/models.html` | `FuelCube Index / Models` | Hero, model cards grid (by size), feature comparison blocks, CTA band |
| `/fuelcube/rental-program.html` | `Program Detail` | Hero, “How rental works” 3-step grid, pricing/terms summary, ideal customers, CTA band |
| `/fuelcube/purchase-program.html` | `Program Detail` | Hero, ownership benefits list, financing or life-cycle value section, CTA band |
| `/fuelcube/placement-support.html` | `Support Detail` | Hero, site survey & placement process steps, safety/permits notes, CTA band |
| `/fuelcube/compliance-safety.html` | `Support Detail` | Hero, safety & compliance overview, checklist, regulatory reassurance, CTA band |

### **2.4 Industries**

| URL | Template | Required sections |
| ----- | ----- | ----- |
| `/industries/index.html` | `Industries Landing` | Hero, 3-column industries grid, short “How we support different sectors” section, CTA band |
| `/industries/construction.html` | `Industry Detail` | Hero, challenges section, solutions section, FuelCube \+ bulk delivery tie-in, CTA band |
| `/industries/agriculture.html` | `Industry Detail` | Hero, fueling needs, seasonal risk, tank placement options, CTA band |
| `/industries/airports-ground-service.html` | `Industry Detail` | Hero, high-uptime requirements, equipment types, emergency response, CTA band |
| `/industries/bus-companies.html` | `Industry Detail` | Hero, fleet reliability, overnight fueling, monitoring, CTA band |
| `/industries/car-dealerships.html` | `Industry Detail` | Hero, demo cars, lot refueling, security and control, CTA band |
| `/industries/data-centers.html` | `Industry Detail` | Hero, uptime and redundancy, generator fueling, compliance, CTA band |
| `/industries/hospitals-healthcare.html` | `Industry Detail` | Hero, life-safety focus, regulatory reliability, backup generator support, CTA band |
| `/industries/manufacturing.html` | `Industry Detail` | Hero, continuous operations, core equipment fueling, FuelCube or bulk tank options, CTA band |
| `/industries/marinas.html` | `Industry Detail` | Hero, water-side fueling concerns, environmental safety, CTA band |
| `/industries/mining-quarry.html` | `Industry Detail` | Hero, remote sites, fuel logistics, FuelCube placement, CTA band |
| `/industries/municipalities.html` | `Industry Detail` | Hero, fleet and facilities, emergency operations, procurement-friendly messaging, CTA band |
| `/industries/power-plants.html` | `Industry Detail` | Hero, continuity, heavy equipment, compliance, CTA band |
| `/industries/scrap-metal.html` | `Industry Detail` | Hero, heavy equipment fueling, yard logistics, CTA band |
| `/industries/taxi-companies.html` | `Industry Detail` | Hero, 24/7 operations, dispatch coordination, CTA band |
| `/industries/truck-stops.html` | `Industry Detail` | Hero, throughput, pricing strategy, backup supply, CTA band |

Antigravity should assign each page to one of these templates and keep the sections in that order.

---

## **3\. Image Strategy Document**

High level rules so images feel like one brand, not a collage.

### **3.1 General style**

* Realistic industrial photography, not illustration

* Moderate contrast with slightly cinematic feel

* Color grading that supports your red and slate palette

* People in proper PPE where applicable (hi-vis vests, hardhats, gloves)

### **3.2 Brand rules**

* Trucks:

  * Tanker-style body

  * Clear “Fox Fuel Heating Oil” branding on the tank or door

* FuelCubes:

  * Western Global style cube tanks with Fox Fuel decal

  * Shown on jobsites, yards, or facilities

* Uniforms:

  * Patches or chest prints with Fox Fuel logo

  * Colors: navy, charcoal, or similar

### **3.3 Hose rules**

* Fuel hose appears only when:

  * Driver is actively delivering

  * Connected to a building fill or FuelCube

* No random loose hoses

### **3.4 Page-to-image mapping**

* Home:

  * Hero: truck in front of industrial or commercial customer site

  * Services: smaller photos tied to bulk, fleet, jobsite

* Services:

  * Each hero: scene specific to that service

  * Secondary images: close-ups of equipment and people working

* FuelCube:

  * Hero: FuelCube on jobsite with equipment

  * Detail: placement near equipment, with safety and environment in mind

* Industries:

  * Landing grid: one representative image per industry

  * Detail pages: hero image specific to that vertical (construction site, marina, hospital, etc.)

### **3.5 Technical requirements**

* Aspect ratios:

  * Hero images: 16:9 or 3:2

  * Grid tiles: 4:3 or 1:1

* Resolution:

  * Desktop hero: minimum 1920 wide

  * Optimized responsive variants for mobile

---

## **4\. Navigation Hierarchy and Interaction Map**

### **4.1 Top navigation (desktop)**

Order:

1. Home

2. Heating Oil (links back to main foxfuel.com if needed)

3. Burner & Tank Services (if retained)

4. Commercial Services

   * Submenu:

     * Bulk Fuel Delivery

     * Fleet Fueling

     * Jobsite Fueling

     * Generator Fueling

     * Fuel Tank Monitoring

5. Industries

   * Submenu:

     * Construction

     * Data Centers

     * Hospitals & Healthcare

     * “View all industries” (links to `/industries/index.html`)

6. Pricing & Payment Plans (if kept from main site)

7. Delivery In Your Area? (if kept)

Right side:

* Contact Us link

* Primary button: Request a Quote

### **4.2 Top navigation (mobile)**

* Logo on left

* Hamburger icon on right

* Full screen or slide-in panel:

  * Same order as desktop

  * Dropdowns for Services and Industries collapsible

* CTA button pinned or near the top inside the menu

### **4.3 Footer structure**

Columns:

1. **Logo \+ short description**

2. **Services**

3. **Industries**

4. **Contact**

Bottom bar:

* Copyright

* Privacy link

* Basic contact line or phone number

Antigravity should derive all nav and footer markup from single shared partials.

---

## **5\. Design Tokens**

For Antigravity to convert into CSS variables.

`:root {`  
  `/* Brand colors */`  
  `--color-primary: #C8102E;      /* Fox red */`  
  `--color-primary-dark: #9E0D22;`  
  `--color-secondary: #0A1931;    /* Industrial slate/navy */`  
  `--color-secondary-light: #13254A;`  
  `--color-bg: #FFFFFF;`  
  `--color-bg-muted: #F5F6F8;`  
  `--color-text: #333333;`  
  `--color-text-muted: #666666;`  
  `--color-border: #E0E3E8;`

  `/* Typography */`  
  `--font-sans: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Roboto", sans-serif;`

  `--font-size-xs: 12px;`  
  `--font-size-sm: 14px;`  
  `--font-size-md: 16px;`  
  `--font-size-lg: 20px;`  
  `--font-size-xl: 28px;`  
  `--font-size-xxl: 36px;`  
  `--font-size-hero: 44px;`

  `/* Spacing scale */`  
  `--space-xxs: 8px;`  
  `--space-xs: 12px;`  
  `--space-sm: 16px;`  
  `--space-md: 24px;`  
  `--space-lg: 32px;`  
  `--space-xl: 48px;`  
  `--space-xxl: 64px;`

  `/* Radii */`  
  `--radius-sm: 4px;`  
  `--radius-md: 8px;`

  `/* Shadows */`  
  `--shadow-card: 0 8px 20px rgba(0, 0, 0, 0.06);`  
`}`

Buttons, cards, etc should reference these tokens rather than hard-coded values.

---

## **6\. Folder and File Architecture Plan**

Recommended structure for the fresh cloned repo.

`root/`  
  `index.html`  
  `services/`  
    `index.html`  
    `bulk-fuel-delivery.html`  
    `fleet-fueling.html`  
    `jobsite-fueling.html`  
    `generator-fueling.html`  
    `monitoring-fuel-management.html`  
  `fuelcube/`  
    `models.html`  
    `rental-program.html`  
    `purchase-program.html`  
    `placement-support.html`  
    `compliance-safety.html`  
  `industries/`  
    `index.html`  
    `construction.html`  
    `agriculture.html`  
    `airports-ground-service.html`  
    `bus-companies.html`  
    `car-dealerships.html`  
    `data-centers.html`  
    `hospitals-healthcare.html`  
    `manufacturing.html`  
    `marinas.html`  
    `mining-quarry.html`  
    `municipalities.html`  
    `power-plants.html`  
    `scrap-metal.html`  
    `taxi-companies.html`  
    `truck-stops.html`

  `assets/`  
    `css/`  
      `base.css`  
      `layout.css`  
      `components.css`  
      `pages/`  
        `home.css`  
        `services.css`  
        `fuelcube.css`  
        `industries.css`  
    `img/`  
      `logo/`  
      `hero/`  
      `services/`  
      `fuelcube/`  
      `industries/`  
    `js/`  
      `main.js`  
      `nav.js   /* dropdown, mobile menu */`

Antigravity should refactor existing assets into this structure where practical.

---

## **7\. Wireframes (Text Specs)**

Think of these as “ASCII wireframes” that Antigravity should follow.

### **7.1 Home template**

1. **Header**

2. **Hero**

   * Left: H1, subtext, primary CTA, secondary link

   * Right: large hero image

3. **Three-service grid**

   * Section title

   * 3 service cards

4. **FuelCube highlight**

   * Left: image

   * Right: dark background block with heading, text, CTA

5. **Industries grid**

   * Section title

   * 3xN tiles with images and labels

6. **Optional trust strip**

   * Icons or short stats

7. **Final CTA band**

   * Short heading \+ button

8. **Footer**

### **7.2 Service Detail template**

1. Header

2. Hero (service specific)

3. Single-column overview paragraph

4. Feature grid (3 or 4 features)

5. Supporting image or text \+ image section

6. Optional industries served strip (linking to relevant industries pages)

7. CTA band

8. Footer

### **7.3 FuelCube template**

1. Header

2. Hero with FuelCube in scene

3. Summary section (“Why on-site tanks”)

4. Split sections alternating image and text:

   * “How the program works”

   * “Safety and compliance”

   * “Ideal use cases”

5. Model or program specifics grid (for models or rental/purchase pages)

6. CTA band

7. Footer

### **7.4 Industries landing template**

1. Header

2. Hero (“Industries We Serve”)

3. Short explanatory paragraph

4. 3-column industries grid

5. CTA band to request a quote or talk to sales

6. Footer

### **7.5 Industry detail template**

1. Header

2. Hero with industry-specific photo

3. “Fueling challenges in \[Industry\]” section (bullets)

4. “How Fox Fuel supports \[Industry\]” 2-column or feature grid

5. FuelCube or service tie-in module

6. CTA band

7. Footer

