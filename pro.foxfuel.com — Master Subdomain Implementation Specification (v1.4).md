# **pro.foxfuel.com — Master Subdomain Implementation Specification (v1.4)**

---

## **1\. Scope, Authority & Lock Statement**

| Attribute | Value |
| ----- | ----- |
| Scope | Entire subdomain |
| Domain | pro.foxfuel.com |
| Status | Final, approved, locked |
| Version | 1.4 |
| Governing Documents | Fox Fuel B2B Division Operating Definition, Messaging & Tone Governance Framework, Blueprint Governance Enforcement |

### **1.1 Authority Statement**

This document is the **sole source of truth** for all content, structure, routing, and governance on pro.foxfuel.com.

This document supersedes all prior versions including v1.0, v1.1, v1.2, v1.3, homepage-only specs, and partial subdomain specs.

If any other instruction conflicts with this document, **this document prevails**.

This document is self-contained. No external references are required for execution.

---

### **1.2 Lock Enforcement (Non-Negotiable)**

* No copy rewriting, editing, optimization, or paraphrasing  
* No vocabulary substitution  
* No inferred values or assumptions  
* No removal, hiding, or replacement of placeholders  
* No added sections, pages, CTAs, or concepts  
* Claude Code must halt and report if any validation check fails

---

### **1.3 Implementation Assumptions (Execution Safety)**

* Site may be static HTML, WordPress, or hybrid  
* Claude Code **may**:  
  * Create new files at specified paths  
  * Modify existing files in place  
  * Add redirects using standard mechanisms  
* Claude Code **must not**:  
  * Change hosting providers  
  * Change build tooling  
  * Introduce new frameworks or libraries  
  * Alter backend systems beyond stub handlers

---

### **1.4 Page Action Definitions**

| Term | Meaning |
| ----- | ----- |
| Replace | Overwrite page body content entirely while preserving global header/footer |
| Modify | Update copy, CTAs, nav, and footer while preserving page shell |
| Create | New page at specified path |
| Delete | Remove page and apply redirect if specified |

#### **1.4.1 Modify Action Rules (When No Full Page Copy Is Provided)**

For any page marked **Action=Modify** where Section 6 does not provide complete page-level content, Claude Code must:

1. **Preserve existing page body copy verbatim** — Do not rewrite paragraphs or sentences  
2. **Replace global navigation** per Section 3.1  
3. **Replace footer** per Section 3.2  
4. **Replace CTAs** per Section 2.4 and Section 8:  
   * Change "Contact Us" → "Request Quote" with destination `/contact/`  
   * Change "Learn More" → "Request Quote" with destination `/contact/`  
   * Change "Get Started" → "Request Quote" with destination `/contact/`  
   * Update all phone CTAs to use `tel:+12156591616`  
5. **Remove all foxfuel.com and www.foxfuel.com links** — Replace internal service/industry links with pro.foxfuel.com equivalents; remove or unlink any residential references  
6. **Remove blacklisted CTA text only** — Do not rewrite body paragraphs to chase vocabulary unless the exact blacklisted term appears as a CTA or headline  
7. **Add Guardrails section** using the appropriate template from Section 6.6 (service pages) or Section 6.7 (industry pages)

---

## **2\. Global Governance Rules**

### **2.1 Domain Separation Rules**

| Rule ID | Rule | Enforcement |
| ----- | ----- | ----- |
| DOM-01 | Zero links to foxfuel.com | Hard block. No exceptions. Applies to all pages, navigation, footer, CTAs. |
| DOM-02 | Zero links to www.foxfuel.com | Hard block. No exceptions. |
| DOM-03 | All internal links must resolve to pro.foxfuel.com | Absolute or relative paths only. |
| DOM-04 | No residential content or language | Site is B2B commercial only. |
| DOM-05 | No cross-routing to residential intake | Forms and CTAs must route to commercial-only pipeline. |

---

### **2.2 Content Rules**

| Rule ID | Rule | Enforcement |
| ----- | ----- | ----- |
| CNT-01 | No copy substitution | Implement exactly as specified. |
| CNT-02 | No placeholder inference | Do not auto-populate bracketed values. |
| CNT-03 | Numbers before adjectives | All proof statements must lead with quantified metrics. |
| CNT-04 | No blacklisted vocabulary | See Section 2.4. |
| CNT-05 | Declarative sentences only | No questions as headlines. No conditional promises. |
| CNT-06 | No emoji or decorative characters | Text only. |
| CNT-07 | No brand storytelling | Operational proof only. |

---

### **2.3 Vocabulary Governance**

**Whitelist (Allowed)**

| Category | Approved Terms |
| ----- | ----- |
| Services | Bulk delivery, fleet fueling, jobsite fueling, generator fueling, emergency dispatch, on-site tank programs, commercial heating oil |
| Outcomes | Uptime, fuel availability, runout prevention, response time, coverage |
| Proof | Years, trucks, gallons, accounts, response time, coverage area |
| Actions | Request quote, schedule delivery, call, dispatch |
| Qualifiers | 24/7, same-day, next-day, scheduled, automatic, metered |

**Blacklist (Prohibited)**

| Term | Reason |
| ----- | ----- |
| Solutions | Vague |
| Trusted partner | Marketing cliché |
| Fueling success | Tagline language |
| We understand your needs | Empty |
| Tailored to your business | Generic |
| Reliable service | Unquantified |
| Quality fuel | Table stakes |
| Competitive pricing | Price-led |
| Learn more | Passive |
| Contact us | Generic |
| Get started | Consumer SaaS |
| Discover | Marketing |
| Seamless | Lifestyle |
| Hassle-free | Consumer |
| Partner | Relationship marketing |
| Commitment to excellence | Empty |
| World-class | Unverifiable |
| Best-in-class | Unverifiable |
| Industry-leading | Unverifiable |

---

### **2.4 CTA Canonical Rules**

**CANONICAL RULE:** All "Request Quote" CTAs across the entire subdomain route to `/contact/`. No exceptions. No `#contact` anchors.

| Rule ID | Rule | Enforcement |
| ----- | ----- | ----- |
| CTA-01 | All "Request Quote" buttons/links route to `/contact/` | Hard rule. Applies to header, homepage, all pages. |
| CTA-02 | No `#contact` anchor links | Use `/contact/` only. |
| CTA-03 | Only operational CTAs allowed | "Request Quote", "Schedule Delivery", "Call \[number\]" |
| CTA-04 | No generic CTAs | "Contact Us", "Learn More", "Get Started" prohibited |
| CTA-05 | All phone CTAs must use tel: protocol | Format: `tel:+12156591616` |
| CTA-06 | All email CTAs must use mailto: protocol | Format: `mailto:commercial@foxfuel.com` |
| CTA-07 | Emergency CTAs must be visually distinct | Red background, white text, phone prominent |
| CTA-08 | Form CTAs route to pro.foxfuel.com only | No external form services routing to residential |

---

### **2.5 Emergency Path Rules**

| Rule ID | Rule | Enforcement |
| ----- | ----- | ----- |
| EMR-01 | Emergency paths must be visually distinct | Different color treatment, phone prominent |
| EMR-02 | Emergency CTAs must use tel: link | Not form submission |
| EMR-03 | Emergency phone must be visible without scrolling | Header placement required |
| EMR-04 | Emergency page must exist | /emergency/ required |
| EMR-05 | Emergency form is minimal | Name, phone, location, fuel type, urgency only |

---

### **2.6 Industry & Service Authorization**

| Rule ID | Rule | Enforcement |
| ----- | ----- | ----- |
| AUTH-01 | Only Operating Definition §2 services may have pages | No invented services |
| AUTH-02 | Only Operating Definition §3 industries may have pages | No unauthorized verticals |
| AUTH-03 | Unauthorized pages must be deleted | Mining & Quarry not in §3 |
| AUTH-04 | Missing authorized pages must be created | Municipal & Government in §3 |

---

## **3\. Global Components**

### **3.1 Navigation Bar**

**Applies to:** All pages

**Structure:**

```
[LOGO] | Services ▾ | Industries ▾ | Service Area | About | [Emergency: (215) 659-1616] | [Request Quote]
```

**Logo:**

| Attribute | Value |
| ----- | ----- |
| Image | `/assets/images/fox-fuel-logo.svg` |
| Link | `https://pro.foxfuel.com/` |
| Alt text | `Fox Fuel` |

**Navigation Items:**

| Label | Type | Destination |
| ----- | ----- | ----- |
| Services | Dropdown | Expands to services list |
| Industries | Dropdown | Expands to industries list |
| Service Area | Link | `/service-area/` |
| About | Link | `/about/` |

**Services Dropdown:**

| Label | Destination |
| ----- | ----- |
| Bulk Fuel Delivery | `/services/bulk-fuel-delivery.html` |
| Fleet Fueling | `/services/fleet-fueling.html` |
| Jobsite Fueling | `/services/jobsite-fueling.html` |
| Generator Fueling | `/services/generator-fueling.html` |
| Commercial Heating Oil | `/services/commercial-heating-oil.html` |
| On-Site Tank Programs | `/services/tank-programs.html` |
| Emergency Delivery | `/services/emergency-delivery.html` |

**Industries Dropdown:**

| Label | Destination |
| ----- | ----- |
| Construction | `/industries/construction.html` |
| Fleet & Transportation | `/industries/fleet-transportation.html` |
| Manufacturing | `/industries/manufacturing.html` |
| Healthcare | `/industries/healthcare.html` |
| Data Centers | `/industries/data-centers.html` |
| Municipal & Government | `/industries/municipal-government.html` |

**Header CTAs:**

| Element | Text | Type | Destination | Style |
| ----- | ----- | ----- | ----- | ----- |
| Emergency | `Emergency: (215) 659-1616` | tel: link | `tel:+12156591616` | Red background (\#C8102E), white text |
| Primary | `Request Quote` | Button | `/contact/` | Red button (\#C8102E) |

**Sticky Behavior:**

* Navigation becomes sticky after scrolling past hero  
* Emergency phone remains visible in sticky state  
* Mobile: Emergency phone visible without opening hamburger menu

**Prohibited Elements:**

* "Heating Oil" link to foxfuel.com  
* Any link to foxfuel.com  
* "Contact Us" text

---

### **3.2 Footer**

**Applies to:** All pages

**Background:** \#1A1A1A

**Layout:** 4-column (desktop), stacked (mobile)

**Column 1 — Brand:**

| Element | Value |
| ----- | ----- |
| Logo | `/assets/images/fox-fuel-logo-white.svg` |
| Tagline | `Commercial Fuel Delivery Since 1981` |

**Column 2 — Services:**

| Label | Destination |
| ----- | ----- |
| Bulk Fuel Delivery | `/services/bulk-fuel-delivery.html` |
| Fleet Fueling | `/services/fleet-fueling.html` |
| Jobsite Fueling | `/services/jobsite-fueling.html` |
| Generator Fueling | `/services/generator-fueling.html` |
| Commercial Heating Oil | `/services/commercial-heating-oil.html` |
| On-Site Tank Programs | `/services/tank-programs.html` |
| Emergency Delivery | `/services/emergency-delivery.html` |

**Column 3 — Industries:**

| Label | Destination |
| ----- | ----- |
| Construction | `/industries/construction.html` |
| Fleet & Transportation | `/industries/fleet-transportation.html` |
| Manufacturing | `/industries/manufacturing.html` |
| Healthcare | `/industries/healthcare.html` |
| Data Centers | `/industries/data-centers.html` |
| Municipal & Government | `/industries/municipal-government.html` |

**Column 4 — Contact:**

```
CONTACT
(215) 659-1616 → tel:+12156591616
commercial@foxfuel.com → mailto:commercial@foxfuel.com
24/7 Emergency Dispatch
```

**Service Area Line:**

```
Serving PA, NJ, DE
```

**Legal Line:**

```
© 2025 Fox Fuel. All rights reserved.
```

**Typography:**

| Element | Font | Size | Color |
| ----- | ----- | ----- | ----- |
| Column headers | Montserrat Semibold | 14px uppercase | \#FFFFFF |
| Links | Open Sans Regular | 14px | \#E5E5E5, hover: \#FFFFFF |
| Tagline | Open Sans Regular | 14px | \#E5E5E5 |
| Legal | Open Sans Regular | 12px | \#999999 |

---

### **3.3 Proof Bar Component**

**Applies to:** Homepage, Service pages (optional), Industry pages (optional)

**Background:** \#2F2F2F

**Layout:** 4-column grid (desktop), 2x2 (mobile)

**Standard Content:**

| Column | Value | Label |
| ----- | ----- | ----- |
| 1 | `43+` | `YEARS IN OPERATION` |
| 2 | `[XX]+` | `TRUCKS IN FLEET` |
| 3 | `[XXX]+` | `COMMERCIAL ACCOUNTS` |
| 4 | `24/7/365` | `EMERGENCY DISPATCH` |

**Typography:**

| Element | Font | Size | Color |
| ----- | ----- | ----- | ----- |
| Value | Montserrat Bold | 36px | \#FFFFFF |
| Label | Open Sans Regular | 14px uppercase | \#E5E5E5 |

---

### **3.4 Standard Page CTA Block Component**

**Applies to:** All service pages, all industry pages

**Background:** \#1A1A1A

**Standard Content:**

```
REQUEST A QUOTE

[Service/Industry]-specific fuel delivery across PA, NJ, DE. Submit form or call directly.

[Request Quote Button] → /contact/

Call direct: (215) 659-1616 → tel:+12156591616
24/7 emergency dispatch available
```

---

## **4\. Page Inventory & Required Actions**

### **4.1 Core Pages**

| Page | Path | Type | Action | Reason |
| ----- | ----- | ----- | ----- | ----- |
| Homepage | `/index.html` | Core | Replace | Governance alignment, full rewrite approved |
| Contact | `/contact/index.html` | Core | Create | Commercial intake, sever B2C routing |
| Emergency | `/emergency/index.html` | Core | Create | Dedicated emergency path required |
| Service Area | `/service-area/index.html` | Core | Create | Geographic qualification |
| About | `/about/index.html` | Core | Create | Operational proof, not brand story |

---

### **4.2 Service Pages**

| Page | Old Path | Canonical Path | Action | Redirect |
| ----- | ----- | ----- | ----- | ----- |
| Services Index | `/services/index.html` | `/services/index.html` | Modify | None |
| Bulk Fuel Delivery | `/services/bulk-fuel-delivery.html` | `/services/bulk-fuel-delivery.html` | Modify | None |
| Fleet Fueling | `/services/fleet-fueling.html` | `/services/fleet-fueling.html` | Modify | None |
| Jobsite Fueling | `/services/jobsite-fueling.html` | `/services/jobsite-fueling.html` | Modify | None |
| Generator Fueling | `/services/generator-fueling.html` | `/services/generator-fueling.html` | Modify | None |
| Commercial Heating Oil | N/A (new) | `/services/commercial-heating-oil.html` | Create | None |
| On-Site Tank Programs | `/fuelcube/purchase-program.html` | `/services/tank-programs.html` | Create | 301 from old path |
| Emergency Delivery | N/A (new) | `/services/emergency-delivery.html` | Create | None |
| Fuel Monitoring | `/services/monitoring-fuel-management.html` | `/services/fuel-monitoring.html` | Rename | 301 from old path |

---

### **4.3 Industry Pages**

| Page | Old Path | Canonical Path | Action | Redirect |
| ----- | ----- | ----- | ----- | ----- |
| Industries Index | `/industries/index.html` | `/industries/index.html` | Modify | None |
| Construction | `/industries/construction.html` | `/industries/construction.html` | Modify | None |
| Fleet & Transportation | N/A (new) | `/industries/fleet-transportation.html` | Create | None |
| Manufacturing | `/industries/manufacturing.html` | `/industries/manufacturing.html` | Modify | None |
| Healthcare | `/industries/hospitals-healthcare.html` | `/industries/healthcare.html` | Rename | 301 from old path |
| Data Centers | `/industries/data-centers.html` | `/industries/data-centers.html` | Modify | None |
| Mining & Quarry | `/industries/mining-quarry.html` | N/A (deleted) | Delete | 301 to `/industries/` |
| Municipal & Government | N/A (new) | `/industries/municipal-government.html` | Create | None |

---

### **4.4 Legacy Paths (Redirect Only)**

| Old Path | Redirect To | Type |
| ----- | ----- | ----- |
| `/fuelcube/purchase-program.html` | `/services/tank-programs.html` | 301 |
| `/fuelcube/*` | `/services/tank-programs.html` | 301 |
| `/services/monitoring-fuel-management.html` | `/services/fuel-monitoring.html` | 301 |
| `/industries/hospitals-healthcare.html` | `/industries/healthcare.html` | 301 |
| `/industries/mining-quarry.html` | `/industries/` | 301 |

---

## **5\. Redirect Implementation**

### **5.1 Redirect Mechanism**

Claude Code must implement redirects using BOTH of the following methods:

1. Netlify `_redirects` file (for Netlify deployments)  
2. Apache `.htaccess` file (for Apache/traditional hosting)

Both files must be generated and included in the build output.

### **5.2 Netlify \_redirects File**

Create file at project root: `_redirects`

```
# pro.foxfuel.com Redirects
# Generated per Implementation Specification v1.4

# FuelCube legacy paths
/fuelcube/purchase-program.html    /services/tank-programs.html    301
/fuelcube/*                        /services/tank-programs.html    301

# Service page renames
/services/monitoring-fuel-management.html    /services/fuel-monitoring.html    301

# Industry page renames
/industries/hospitals-healthcare.html    /industries/healthcare.html    301

# Deleted pages
/industries/mining-quarry.html    /industries/    301
```

### **5.3 Apache .htaccess File**

Create file at project root: `.htaccess`

```
# pro.foxfuel.com Redirects
# Generated per Implementation Specification v1.4

RewriteEngine On

# FuelCube legacy paths
RewriteRule ^fuelcube/purchase-program\.html$ /services/tank-programs.html [R=301,L]
RewriteRule ^fuelcube/(.*)$ /services/tank-programs.html [R=301,L]

# Service page renames
RewriteRule ^services/monitoring-fuel-management\.html$ /services/fuel-monitoring.html [R=301,L]

# Industry page renames
RewriteRule ^industries/hospitals-healthcare\.html$ /industries/healthcare.html [R=301,L]

# Deleted pages
RewriteRule ^industries/mining-quarry\.html$ /industries/ [R=301,L]
```

---

## **6\. Page-Level Content Specifications**

### **6.1 Homepage**

#### **6.1.1 Hero Section**

**Background:** Dark overlay (70% opacity, \#1A1A1A) over industrial/truck imagery

**Badge:**

```
24/7 EMERGENCY DISPATCH • PA • NJ • DE
```

**Headline (H1):**

```
Bulk Diesel. Fleet Fueling. Emergency Dispatch.
```

**Subhead:**

```
Scheduled bulk delivery and on-site tank programs for commercial and industrial operations across Pennsylvania, New Jersey, and Delaware.
```

**Primary CTA:**

```
Request Quote
```

* Destination: `/contact/`  
* Style: Red button (\#C8102E)

**Secondary CTA:**

```
Emergency: (215) 659-1616
```

* Destination: `tel:+12156591616`  
* Style: White outline button

**Micro-proof:**

```
Serving commercial operations since 1981
```

---

#### **6.1.2 Proof Bar**

| Column | Value | Label |
| ----- | ----- | ----- |
| 1 | `43+` | `YEARS IN OPERATION` |
| 2 | `[XX]+` | `TRUCKS IN FLEET` |
| 3 | `[XXX]+` | `COMMERCIAL ACCOUNTS` |
| 4 | `24/7/365` | `EMERGENCY DISPATCH` |

---

#### **6.1.3 Core Services Section**

**Section Header:**

```
COMMERCIAL FUEL SERVICES
```

**Card 1:**

```
Title: BULK FUEL DELIVERY
Body: Scheduled diesel and heating oil delivery to your storage tanks. Automatic reorder available. Volume pricing for high-consumption accounts.
CTA: Request Quote →
CTA Destination: /contact/
```

**Card 2:**

```
Title: FLEET FUELING
Body: On-site diesel delivery to your yard or depot. Overnight fueling. Per-vehicle tracking available. Drivers start with full tanks.
CTA: Request Quote →
CTA Destination: /contact/
```

**Card 3:**

```
Title: JOBSITE FUELING
Body: Direct-to-equipment fueling at construction and industrial sites. Metered dispensing. Job-cost documentation.
CTA: Request Quote →
CTA Destination: /contact/
```

**Card 4:**

```
Title: GENERATOR FUELING
Body: Scheduled and emergency diesel delivery for standby generators. Pre-storm fills. Fuel quality management. Compliance documentation.
CTA: Request Quote →
CTA Destination: /contact/
```

**Card 5:**

```
Title: ON-SITE TANK PROGRAMS
Body: Managed diesel storage at your location. Automatic monitoring. Scheduled refills. No runouts.
CTA: Request Quote →
CTA Destination: /contact/
```

**Card 6:**

```
Title: EMERGENCY DELIVERY
Body: 24/7/365 dispatch for fuel outages. Same-day and next-day response. Priority service for established accounts.
CTA: Call (215) 659-1616 →
CTA Destination: tel:+12156591616
```

---

#### **6.1.4 On-Site Tank Programs Section**

**Section Header:**

```
ON-SITE TANK PROGRAMS
```

**Body:**

```
Managed diesel storage installed at your location. Telemetry monitors fuel level. Automatic dispatch when tank reaches reorder threshold. No manual monitoring. No runouts. No off-site fueling trips.

Equipment options: purchase, rental, or loaner programs based on volume commitment.
```

**CTA:**

```
Request Quote
```

* Destination: `/contact/`

---

#### **6.1.5 Industries Section**

**Section Header:**

```
INDUSTRIES SERVED
```

**Grid (6 tiles):**

| Label | Destination |
| ----- | ----- |
| `CONSTRUCTION` | `/industries/construction.html` |
| `FLEET & TRANSPORTATION` | `/industries/fleet-transportation.html` |
| `MANUFACTURING` | `/industries/manufacturing.html` |
| `HEALTHCARE` | `/industries/healthcare.html` |
| `DATA CENTERS` | `/industries/data-centers.html` |
| `MUNICIPAL & GOVERNMENT` | `/industries/municipal-government.html` |

---

#### **6.1.6 How It Works Section**

**Section Header:**

```
HOW IT WORKS
```

**Step 1:**

```
Number: 01
Title: REQUEST QUOTE
Body: Call or submit form. Provide location, fuel type, volume estimate, and service requirements.
```

**Step 2:**

```
Number: 02
Title: SITE ASSESSMENT
Body: We confirm access, tank compatibility, and delivery logistics. Custom accounts receive on-site evaluation.
```

**Step 3:**

```
Number: 03
Title: SCHEDULED DELIVERY
Body: Fuel delivered on agreed schedule. Metered dispensing. Documentation provided same-day.
```

**Step 4:**

```
Number: 04
Title: ONGOING SERVICE
Body: Automatic reorder for monitored accounts. 24/7 emergency dispatch available. One vendor. One number.
```

---

#### **6.1.7 Differentiators Section**

**Section Header:**

```
WHY FOX FUEL
```

**Column 1:**

```
Title: REGIONAL FLEET. REGIONAL DISPATCH.
Body: Trucks and drivers operate from Pennsylvania. Local dispatch. No out-of-state brokerage.
```

**Column 2:**

```
Title: 43 YEARS. FAMILY-OWNED.
Body: Founded 1981. Same ownership. Consistent service year over year.
```

**Column 3:**

```
Title: 24/7/365 EMERGENCY RESPONSE.
Body: Phone answered every hour of every day. Direct dispatch. No call centers. No ticket queues.
```

---

#### **6.1.8 Final CTA Section**

**Headline:**

```
REQUEST A QUOTE
```

**Body:**

```
Bulk delivery. Fleet fueling. Emergency dispatch. Submit form or call directly.
```

**Form:** See Section 7.1

**Alternative Path:**

```
Call direct: (215) 659-1616
24/7 emergency dispatch available
```

---

### **6.2 Contact Page**

**Path:** `/contact/index.html`

**H1:**

```
REQUEST A QUOTE
```

**Body:**

```
Commercial fuel delivery across PA, NJ, DE. Submit form or call directly. Response within one business day.
```

**Form:** See Section 7.1

**Alternative Path:**

```
Call direct: (215) 659-1616
24/7 emergency dispatch available
```

**Emergency Callout:**

```
NEED EMERGENCY FUEL?
For immediate dispatch, call (215) 659-1616 or visit our emergency page.
[Emergency Fuel Request] → /emergency/
```

---

### **6.3 Emergency Page**

**Path:** `/emergency/index.html`

**H1:**

```
24/7 EMERGENCY FUEL DISPATCH
```

**Primary Phone Block:**

```
(215) 659-1616
Call now for immediate dispatch
```

* Style: Large, prominent, red background  
* Link: `tel:+12156591616`

**Body:**

```
Emergency fuel delivery for commercial and industrial operations across PA, NJ, DE. Generator outages. Unexpected depletion. Supply disruptions. We respond.
```

**When to Call:**

```
WHEN TO CALL
- Generator fuel critical during outage
- Unexpected equipment fuel depletion
- Supply chain disruption
- Pre-storm fuel top-off for backup power
```

**What to Expect:**

```
WHAT TO EXPECT
- Immediate phone response
- Same-day or next-day delivery based on availability
- Priority dispatch for established accounts
- Storm and outage response for critical facilities
```

**Emergency Form:** See Section 7.2

**Non-Emergency Path:**

```
For scheduled delivery or new account setup, request a quote instead.
[Request Quote] → /contact/
```

---

### **6.4 Service Area Page**

**Path:** `/service-area/index.html`

**H1:**

```
SERVICE AREA
```

**Intro:**

```
Fox Fuel provides commercial fuel delivery across Pennsylvania, New Jersey, and Delaware. Regional fleet. Local dispatch. No out-of-state brokerage.
```

**Coverage Section:**

```
COVERAGE

Pennsylvania
Bucks, Montgomery, Philadelphia, Delaware, Chester, Lehigh, Northampton, Berks, Lancaster counties and surrounding areas.

New Jersey
Burlington, Camden, Gloucester, Mercer, Hunterdon, Somerset, Middlesex, Monmouth counties and surrounding areas.

Delaware
New Castle, Kent counties and surrounding areas.
```

**Service Notes:**

```
SERVICE NOTES
- Delivery availability varies by location and volume
- Emergency dispatch available 24/7 for established accounts
- New locations assessed for access and logistics prior to first delivery
- Contact us to confirm coverage for your specific location
```

**CTA Block:**

```
REQUEST A QUOTE

Confirm coverage and schedule delivery for your location.

[Request Quote] → /contact/

Call direct: (215) 659-1616 → tel:+12156591616
```

---

### **6.5 About Page**

**Path:** `/about/index.html`

**H1:**

```
ABOUT FOX FUEL
```

**Intro:**

```
Fox Fuel has delivered bulk fuel to commercial and industrial operations since 1981. Family-owned. Regionally operated. 43 years in continuous service.
```

**Operations Section:**

```
OPERATIONS

Fleet and drivers based in Pennsylvania. Local dispatch for PA, NJ, DE coverage. No third-party brokerage. Deliveries made by Fox Fuel trucks.

Fuel types: diesel (on-road), diesel (off-road), heating oil, DEF.

Services: bulk delivery, fleet fueling, jobsite fueling, generator fueling, on-site tank programs, emergency dispatch.
```

**History Section:**

```
HISTORY

Founded 1981. Same family ownership for 43 years. Expanded from residential heating oil into commercial and industrial fuel services. Dedicated B2B division serves fleet, construction, manufacturing, healthcare, data center, and municipal operations.
```

**Proof Bar:** Include standard Proof Bar component per Section 3.3

**CTA Block:**

```
REQUEST A QUOTE

Commercial fuel delivery across PA, NJ, DE.

[Request Quote] → /contact/

Call direct: (215) 659-1616 → tel:+12156591616
24/7 emergency dispatch available
```

---

### **6.6 Service Pages**

#### **6.6.1 Service Page Required Structure**

Each service page must follow this structure:

| Section | Content Type |
| ----- | ----- |
| H1 | Service name \+ geographic scope |
| Intro | 2-3 sentences, operational language |
| What's Included | Bullet list, specific deliverables |
| How It Works | 3-4 steps for this service |
| Guardrails | Minimums, access requirements, expectations |
| Industries Served | Links to relevant industry pages |
| CTA Block | Standard Page CTA Block component |

#### **6.6.2 Service Page Guardrails Template (For Modified Pages)**

For service pages marked **Action=Modify** where no full Guardrails section is provided, insert the following template at the end of the page body, before the CTA Block:

```
SERVICE REQUIREMENTS
Minimum delivery volumes and access requirements apply. Service availability varies by location. Contact us to confirm service parameters for your operation.
```

---

#### **6.6.3 Commercial Heating Oil (NEW PAGE)**

**Path:** `/services/commercial-heating-oil.html`

**H1:**

```
COMMERCIAL HEATING OIL DELIVERY
```

**Intro:**

```
Bulk heating oil delivery for commercial and industrial facilities across PA, NJ, DE. Warehouses, office buildings, manufacturing plants, institutional facilities.
```

**What's Included:**

```
WHAT'S INCLUDED
- Scheduled bulk heating oil delivery
- Automatic delivery based on degree-day monitoring
- Will-call delivery for manual ordering
- Tank compatibility assessment
- Volume pricing for high-consumption accounts
```

**How It Works:**

```
HOW IT WORKS
01. REQUEST QUOTE — Provide facility location, tank size, and estimated consumption.
02. ASSESSMENT — We confirm tank access and delivery logistics.
03. SCHEDULED DELIVERY — Fuel delivered on agreed schedule or automatic trigger.
04. ONGOING SERVICE — Automatic reorder available. 24/7 emergency dispatch for runouts.
```

**Guardrails:**

```
SERVICE REQUIREMENTS
Minimum delivery volumes apply based on location. Tank must be accessible for delivery vehicle. Commercial accounts only. Residential accounts are out of scope for this site.
```

**Industries Served:**

```
INDUSTRIES SERVED
Manufacturing | Healthcare | Municipal & Government | Fleet & Transportation
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.6.4 On-Site Tank Programs (NEW PAGE)**

**Path:** `/services/tank-programs.html`

**Redirects from:** `/fuelcube/purchase-program.html`, `/fuelcube/*`

**H1:**

```
ON-SITE TANK PROGRAMS
```

**Intro:**

```
Managed diesel storage installed at your location. Telemetry monitors fuel level. Automatic dispatch when tank reaches reorder threshold. No manual monitoring. No runouts. No off-site fueling trips.
```

**What's Included:**

```
WHAT'S INCLUDED
- Above-ground diesel storage tanks
- Remote telemetry fuel monitoring
- Automatic reorder at threshold
- Scheduled delivery by Fox Fuel fleet
- Equipment options: purchase, rental, or loaner
```

**Program Options:**

```
PROGRAM OPTIONS

PURCHASE
Outright equipment ownership. Fox Fuel supplies fuel and monitoring.

RENTAL
Monthly rental fee. Includes equipment, monitoring, and priority service.

LOANER
No equipment cost with volume commitment. Tank provided at no charge with fuel agreement.
```

**How It Works:**

```
HOW IT WORKS
01. SITE ASSESSMENT — We evaluate location, access, and volume requirements.
02. EQUIPMENT SELECTION — Choose purchase, rental, or loaner program.
03. INSTALLATION — Tank installed at your location with monitoring hardware.
04. AUTOMATIC SERVICE — Telemetry triggers dispatch. Fuel delivered before runout.
```

**Guardrails:**

```
SERVICE REQUIREMENTS
Site must accommodate above-ground tank installation. Loaner programs require minimum volume commitment. Access for delivery vehicle required.
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.6.5 Emergency Delivery (NEW PAGE)**

**Path:** `/services/emergency-delivery.html`

**H1:**

```
24/7 EMERGENCY FUEL DELIVERY
```

**Intro:**

```
Emergency fuel dispatch for commercial and industrial operations. Generator outages. Unexpected depletion. Supply disruptions. Phone answered every hour of every day.
```

**Primary Phone Block:**

```
(215) 659-1616
```

* Style: Prominent, red background  
* Link: `tel:+12156591616`

**What's Included:**

```
WHAT'S INCLUDED
- 24/7/365 phone dispatch
- Same-day and next-day response
- Diesel, off-road diesel, heating oil
- Generator fills during outages
- Storm and weather event response
```

**What to Expect:**

```
WHAT TO EXPECT
- Phone answered by dispatch, not voicemail
- Location and fuel type confirmed on call
- Estimated arrival time provided
- Priority service for established accounts
- New customers served based on availability
```

**Guardrails:**

```
EMERGENCY SERVICE NOTES
Emergency dispatch is prioritized for established commercial accounts. New emergency requests are served based on fleet availability and location. For non-emergency fuel needs, request a quote instead.
```

**CTA Block:** Emergency variant with phone link → `tel:+12156591616`

---

#### **6.6.6 Fuel Monitoring (RENAMED PAGE)**

**Old Path:** `/services/monitoring-fuel-management.html`

**Canonical Path:** `/services/fuel-monitoring.html`

**Redirect:** 301 from old path to canonical path

**H1:**

```
FUEL TANK MONITORING
```

**Intro:**

```
Remote fuel level monitoring for commercial storage tanks. Real-time visibility. Automatic alerts. Data for consumption planning.
```

**What's Included:**

```
WHAT'S INCLUDED
- Cellular-connected tank monitors
- Real-time fuel level visibility
- Low-level alerts and notifications
- Consumption tracking and reporting
- Integration with automatic delivery
```

**How It Works:**

```
HOW IT WORKS
01. ASSESSMENT — We evaluate tank compatibility and connectivity.
02. INSTALLATION — Monitor installed on existing or new tank.
03. ACTIVATION — System connected to monitoring platform.
04. ONGOING VISIBILITY — Access fuel levels and consumption data. Automatic delivery available.
```

**Guardrails:**

```
SERVICE REQUIREMENTS
Monitoring requires compatible tank installation. Cellular connectivity required at site. Available as standalone service or bundled with on-site tank programs.
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.6.7 Existing Service Page Modifications**

**Required changes for:**

* `/services/bulk-fuel-delivery.html`  
* `/services/fleet-fueling.html`  
* `/services/jobsite-fueling.html`  
* `/services/generator-fueling.html`

| Change | Specification |
| ----- | ----- |
| Remove all foxfuel.com links | Zero links to main domain |
| Update CTAs | "Request Quote" → `/contact/` |
| Remove blacklisted CTA text | Per Section 1.4.1 |
| Add guardrails section | Use template from Section 6.6.2 |
| Update navigation | Match global nav specification |
| Update footer | Match global footer specification |

---

### **6.7 Industry Pages**

#### **6.7.1 Industry Page Required Structure**

Each industry page must follow this structure:

| Section | Content Type |
| ----- | ----- |
| H1 | Industry name \+ fuel positioning |
| Industry Pain Point | What downtime/fuel shortage means for this industry |
| Services for Industry | Which Fox Fuel services address needs |
| Proof Points | Industry-relevant metrics or outcomes |
| CTA Block | Standard Page CTA Block component |

#### **6.7.2 Industry Page Guardrails Template (For Modified Pages)**

For industry pages marked **Action=Modify** where no full content rewrite is provided, insert the following template at the end of the page body, before the CTA Block:

```
SERVICE AVAILABILITY
Delivery availability and service parameters vary by location and operational requirements. Contact us to confirm coverage and discuss your specific fuel needs.
```

---

#### **6.7.3 Municipal & Government (NEW PAGE)**

**Path:** `/industries/municipal-government.html`

**H1:**

```
MUNICIPAL & GOVERNMENT FUEL SERVICES
```

**Industry Pain Point:**

```
Public operations require uninterrupted fuel supply. Public works fleets, school transportation, emergency services, water treatment — downtime affects constituents. Procurement requires documentation, contract compliance, and tax-exempt processing.
```

**Services for Industry:**

```
SERVICES FOR MUNICIPAL OPERATIONS
- Bulk diesel delivery for public works fleets and equipment
- Fleet fueling for municipal vehicle yards
- Generator fueling for critical public facilities
- Emergency dispatch for storm and outage response
- On-site tank programs for high-volume locations
```

**Procurement Callout:**

```
GOVERNMENT PROCUREMENT
- Contract pricing structures
- Tax-exempt processing
- Documentation for audit requirements
- Multi-year agreement options
- Cooperative purchasing compatibility
```

**Facilities Served:**

```
FACILITIES SERVED
- Public works departments
- School district transportation
- Municipal vehicle fleets
- Water and wastewater treatment
- Emergency services facilities
- Administrative buildings
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.7.4 Fleet & Transportation (NEW PAGE)**

**Path:** `/industries/fleet-transportation.html`

**H1:**

```
FLEET & TRANSPORTATION FUEL SERVICES
```

**Industry Pain Point:**

```
Every hour at the pump is an hour off the road. Fuel station detours cost driver time, increase liability exposure, and reduce route efficiency. Fleets need fuel delivered to the yard so drivers start with full tanks.
```

**Services for Industry:**

```
SERVICES FOR FLEET OPERATIONS
- On-site fleet fueling at your yard or depot
- Overnight fueling during off-hours
- Per-vehicle fuel tracking and reporting
- Bulk diesel delivery for fleet storage tanks
- On-site tank programs with automatic monitoring
- Emergency dispatch for unexpected shortages
```

**Operational Benefits:**

```
OPERATIONAL BENEFITS
- Drivers start routes with full tanks
- Eliminate fuel station detours
- Reduce fuel theft and shrinkage
- Per-vehicle consumption tracking
- Volume pricing for high-consumption fleets
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.7.5 Healthcare (RENAMED PAGE)**

**Old Path:** `/industries/hospitals-healthcare.html`

**Canonical Path:** `/industries/healthcare.html`

**Redirect:** 301 from old path to canonical path

**H1:**

```
HEALTHCARE FACILITY FUEL SERVICES
```

**Industry Pain Point:**

```
Generator downtime at a healthcare facility is not an option. Backup power systems require reliable fuel supply, pre-storm fills, and 24/7 emergency dispatch. Compliance documentation and fuel quality management are operational requirements.
```

**Services for Industry:**

```
SERVICES FOR HEALTHCARE FACILITIES
- Generator fueling for backup power systems
- Pre-storm and emergency fills
- Fuel quality management and testing referrals
- Scheduled bulk delivery for facility heating
- On-site tank programs with automatic monitoring
- 24/7 emergency dispatch
```

**Compliance Callout:**

```
COMPLIANCE & DOCUMENTATION
- Delivery documentation for audit requirements
- Fuel quality records
- Emergency response planning support
- Priority dispatch for critical facilities
```

**CTA Block:** Standard component → `/contact/`

---

#### **6.7.6 Existing Industry Page Modifications**

**Required changes for:**

* `/industries/construction.html`  
* `/industries/data-centers.html`  
* `/industries/manufacturing.html`

| Change | Specification |
| ----- | ----- |
| Remove all foxfuel.com links | Zero links to main domain |
| Update CTAs | "Request Quote" → `/contact/` |
| Remove blacklisted CTA text | Per Section 1.4.1 |
| Add service availability section | Use template from Section 6.7.2 |
| Update navigation | Match global nav specification |
| Update footer | Match global footer specification |

---

#### **6.7.7 Mining & Quarry (DELETE)**

**Path:** `/industries/mining-quarry.html`

**Action:** DELETE

**Reason:** Mining & Quarry not listed in Operating Definition §3 Target Industries. Unauthorized industry page.

**Redirect:** 301 redirect to `/industries/`

---

## **7\. Forms & Intake Specification**

### **7.1 Commercial Intake Form**

**Form ID:** `commercial-intake-form`

**Location:** `/contact/index.html`, Homepage Final CTA Section

**Method:** POST

**Implementation Instruction:** Implement frontend form with full validation. Implement a stub handler that logs form data to console and displays success message. Mark submission endpoint with TODO for final integration.

```javascript
// TODO: Replace stub handler with actual form submission endpoint
// Endpoint must route to commercial CRM pipeline only
// Must NOT route to foxfuel.com or residential pipeline
const FORM_ENDPOINT = 'TODO_COMMERCIAL_ENDPOINT';
```

**Fields:**

| Field Name | Label | Type | Required | Options |
| ----- | ----- | ----- | ----- | ----- |
| `company_name` | Company Name | text | Yes | — |
| `contact_name` | Contact Name | text | Yes | — |
| `phone` | Phone | tel | Yes | — |
| `email` | Email | email | Yes | — |
| `industry` | Industry | select | Yes | See below |
| `service_interest` | Service Interest | select | Yes | See below |
| `monthly_volume` | Estimated Monthly Volume | select | No | See below |
| `notes` | Location / Notes | textarea | No | — |

**Industry Options:**

```
Construction
Fleet & Transportation
Manufacturing
Healthcare
Data Centers
Municipal & Government
Other
```

**Service Interest Options:**

```
Bulk Fuel Delivery
Fleet Fueling
Jobsite Fueling
Generator Fueling
Commercial Heating Oil
On-Site Tank Program
Emergency Delivery
Multiple Services
```

**Monthly Volume Options:**

```
Under 500 gallons/month
500–2,000 gallons/month
2,000–10,000 gallons/month
10,000+ gallons/month
Not sure
```

**Submit Button:**

```
Submit Quote Request
```

**Validation Rules:**

| Field | Rule |
| ----- | ----- |
| `company_name` | Required, min 2 characters |
| `contact_name` | Required, min 2 characters |
| `phone` | Required, valid phone format |
| `email` | Required, valid email format |
| `industry` | Required, must select |
| `service_interest` | Required, must select |
| `monthly_volume` | Optional |
| `notes` | Optional, max 1000 characters |

**Stub Handler Behavior:**

1. Validate all required fields  
2. Log form data to console  
3. Display success message: "Quote request received. We will respond within one business day."  
4. Clear form

---

### **7.2 Emergency Intake Form**

**Form ID:** `emergency-intake-form`

**Location:** `/emergency/index.html`

**Method:** POST

**Implementation Instruction:** Implement frontend form with full validation. Implement a stub handler that logs form data to console and displays success message. Mark submission endpoint with TODO for final integration.

```javascript
// TODO: Replace stub handler with actual form submission endpoint
// Endpoint should route to emergency dispatch queue or commercial pipeline with urgency flag
const EMERGENCY_FORM_ENDPOINT = 'TODO_EMERGENCY_ENDPOINT';
```

**Fields:**

| Field Name | Label | Type | Required | Options |
| ----- | ----- | ----- | ----- | ----- |
| `contact_name` | Name | text | Yes | — |
| `phone` | Phone | tel | Yes | — |
| `location` | Location / Address | text | Yes | — |
| `fuel_type` | Fuel Type | select | Yes | See below |
| `urgency` | Urgency | select | Yes | See below |
| `notes` | Additional Details | textarea | No | — |

**Fuel Type Options:**

```
Diesel (on-road)
Diesel (off-road)
Heating Oil
Not Sure
```

**Urgency Options:**

```
Immediate (within hours)
Today
Tomorrow
This Week
```

**Submit Button:**

```
Submit Emergency Request
```

**Validation Rules:**

| Field | Rule |
| ----- | ----- |
| `contact_name` | Required, min 2 characters |
| `phone` | Required, valid phone format |
| `location` | Required, min 5 characters |
| `fuel_type` | Required, must select |
| `urgency` | Required, must select |
| `notes` | Optional, max 500 characters |

**Phone Callout (above form):**

```
For fastest response, call directly:
(215) 659-1616
```

**Stub Handler Behavior:**

1. Validate all required fields  
2. Log form data to console with urgency flag  
3. Display success message: "Emergency request received. For immediate dispatch, call (215) 659-1616."  
4. Do NOT clear form (user may need to reference)

---

## **8\. CTA & Routing Master Table**

### **8.1 Allowed CTAs**

| CTA Text | Type | Destination | Allowed Pages | Style |
| ----- | ----- | ----- | ----- | ----- |
| `Request Quote` | Button | `/contact/` | All pages | Red button (\#C8102E) |
| `Request Quote →` | Link | `/contact/` | Service cards, page CTAs | Red text (\#C8102E) |
| `Emergency: (215) 659-1616` | Button | `tel:+12156591616` | Header (all pages), Hero | Red background, white text |
| `Call (215) 659-1616 →` | Link | `tel:+12156591616` | Emergency service card, emergency callouts | Red text (\#C8102E) |
| `(215) 659-1616` | Link | `tel:+12156591616` | Contact section, footer, emergency page | Varies by context |
| `commercial@foxfuel.com` | Link | `mailto:commercial@foxfuel.com` | Footer, contact page | Standard link |
| `Submit Quote Request` | Button | Form submission | Contact form, homepage form | Red button (\#C8102E) |
| `Submit Emergency Request` | Button | Form submission | Emergency form | Red button (\#C8102E) |
| `Emergency Fuel Request` | Button | `/emergency/` | Contact page callout | Red button (\#C8102E) |

### **8.2 Prohibited CTAs**

| CTA Text | Reason |
| ----- | ----- |
| `Contact Us` | Generic |
| `Learn More` | Passive, educational |
| `Get Started` | Consumer SaaS |
| `Get a Free Quote` | "Free" implies transaction |
| `See How We Can Help` | Vague |
| `Request a Free Quote` | "Free" language |
| `View FuelCube Options` | Product marketing |
| `Request Site Assessment` | Replace with "Request Quote" |
| Any CTA using `#contact` | Use `/contact/` only |

### **8.3 Routing Rules**

| Destination Type | Allowed Destinations | Prohibited Destinations |
| ----- | ----- | ----- |
| Internal links | `pro.foxfuel.com/*`, relative paths | `foxfuel.com/*`, `www.foxfuel.com/*` |
| Phone | `tel:+12156591616` | Any other format |
| Email | `mailto:commercial@foxfuel.com` | Any foxfuel.com email on this subdomain |
| Form submission | pro.foxfuel.com commercial endpoint | foxfuel.com forms, residential pipeline |
| Quote CTAs | `/contact/` | `#contact`, external URLs |

---

## **9\. Placeholders & Owner-Provided Data**

### **9.1 Placeholder List**

| Placeholder | Location | Format | Current Value |
| ----- | ----- | ----- | ----- |
| `[XX]+` | Proof bar (all pages with proof bar) | Number \+ `+` | Unknown — awaiting Fox Fuel |
| `[XXX]+` | Proof bar (all pages with proof bar) | Number \+ `+` | Unknown — awaiting Fox Fuel |

### **9.2 Placeholder Rules**

| Rule | Enforcement |
| ----- | ----- |
| Do not infer values | Hard block |
| Do not auto-populate | Hard block |
| Do not remove placeholders | Hard block |
| Do not hide placeholders | Hard block |
| Implement exactly as written | Include brackets |

### **9.3 Confirmed Values**

| Item | Value | Source |
| ----- | ----- | ----- |
| Phone | (215) 659-1616 | Existing site |
| Years | 43+ | Calculated from 1981 |
| Email | commercial@foxfuel.com | Governance spec |
| Service area | PA, NJ, DE | Existing site |
| Founding year | 1981 | Existing site |

### **9.4 Data Required from Fox Fuel**

| Data Point | Purpose | Format Needed |
| ----- | ----- | ----- |
| Truck count | Proof bar | Number |
| Commercial account count | Proof bar | Number |
| Form submission endpoint | Intake routing | URL or integration spec |

---

## **10\. Validation Checklist**

Claude Code must verify ALL items before declaring implementation complete. If ANY item fails, HALT and REPORT.

### **10.1 Domain Separation**

```
[ ] Zero links to foxfuel.com on any page
[ ] Zero links to www.foxfuel.com on any page
[ ] All internal links resolve to pro.foxfuel.com
[ ] Navigation contains no foxfuel.com links
[ ] Footer contains no foxfuel.com links
[ ] "Heating Oil" link to B2C site removed from navigation
```

### **10.2 Page Existence**

```
[ ] Homepage exists at /index.html and contains new content
[ ] /contact/index.html exists
[ ] /emergency/index.html exists
[ ] /service-area/index.html exists
[ ] /about/index.html exists
[ ] /services/commercial-heating-oil.html exists
[ ] /services/tank-programs.html exists
[ ] /services/emergency-delivery.html exists
[ ] /services/fuel-monitoring.html exists
[ ] /industries/municipal-government.html exists
[ ] /industries/fleet-transportation.html exists
[ ] /industries/healthcare.html exists
[ ] /industries/mining-quarry.html DELETED or returns 404
```

### **10.3 Redirects**

```
[ ] _redirects file exists at project root
[ ] .htaccess file exists at project root
[ ] /fuelcube/purchase-program.html redirects to /services/tank-programs.html
[ ] /fuelcube/* redirects to /services/tank-programs.html
[ ] /services/monitoring-fuel-management.html redirects to /services/fuel-monitoring.html
[ ] /industries/hospitals-healthcare.html redirects to /industries/healthcare.html
[ ] /industries/mining-quarry.html redirects to /industries/
```

### **10.4 Navigation**

```
[ ] Navigation matches spec (Services, Industries, Service Area, About)
[ ] Services dropdown contains 7 items as specified
[ ] Industries dropdown contains 6 items as specified
[ ] Emergency phone visible in header
[ ] "Request Quote" button in header routes to /contact/
[ ] No "Heating Oil" link in navigation
[ ] No "Contact Us" text in navigation
[ ] Header logo uses /assets/images/fox-fuel-logo.svg
```

### **10.5 CTAs**

```
[ ] All "Request Quote" buttons route to /contact/
[ ] Zero "Request Quote" CTAs use #contact anchor
[ ] All emergency phone CTAs use tel:+12156591616
[ ] No CTAs route to foxfuel.com
[ ] No "Contact Us" CTAs exist
[ ] No "Learn More" CTAs exist
[ ] No "Get Started" CTAs exist
[ ] Emergency CTAs visually distinct (red background)
```

### **10.6 Forms**

```
[ ] Commercial intake form contains all 8 fields
[ ] Industry dropdown contains 7 options
[ ] Service Interest dropdown contains 8 options
[ ] Monthly Volume dropdown contains 5 options
[ ] Emergency form contains all 6 fields
[ ] Forms implement stub handlers with TODO comments
[ ] Forms do NOT submit to foxfuel.com
[ ] Submit buttons use specified text
```

### **10.7 Content**

```
[ ] Homepage hero headline matches spec exactly
[ ] Homepage hero subhead matches spec exactly
[ ] All 6 service cards present on homepage
[ ] All 6 industry tiles present on homepage
[ ] All 4 "How It Works" steps present
[ ] All 3 differentiator columns present
[ ] Footer matches spec
[ ] Footer logo uses /assets/images/fox-fuel-logo-white.svg
```

### **10.8 Placeholders**

```
[ ] Proof bar column 2 displays "[XX]+"
[ ] Proof bar column 3 displays "[XXX]+"
[ ] Placeholders not hidden or removed
[ ] Placeholders not auto-populated
```

### **10.9 Vocabulary**

```
[ ] "Solutions" does not appear
[ ] "Trusted partner" does not appear
[ ] "Fueling success" does not appear
[ ] "Contact us" does not appear (as CTA)
[ ] "Learn more" does not appear (as CTA)
[ ] "Competitive pricing" does not appear
[ ] "FuelCube" does not appear as primary framing
```

### **10.10 Page Structure**

```
[ ] All service pages have guardrails section
[ ] All industry pages have service availability section
[ ] All pages have consistent navigation
[ ] All pages have consistent footer
[ ] Emergency page has prominent phone display
[ ] Service Area page exists with coverage content
[ ] About page exists with operational content
```

---

## **11\. File Structure**

### **11.1 Required Files**

```
pro.foxfuel.com/
├── _redirects
├── .htaccess
├── index.html
├── assets/
│   └── images/
│       ├── fox-fuel-logo.svg
│       └── fox-fuel-logo-white.svg
├── contact/
│   └── index.html
├── emergency/
│   └── index.html
├── service-area/
│   └── index.html
├── about/
│   └── index.html
├── services/
│   ├── index.html
│   ├── bulk-fuel-delivery.html
│   ├── fleet-fueling.html
│   ├── jobsite-fueling.html
│   ├── generator-fueling.html
│   ├── commercial-heating-oil.html
│   ├── tank-programs.html
│   ├── emergency-delivery.html
│   └── fuel-monitoring.html
└── industries/
    ├── index.html
    ├── construction.html
    ├── fleet-transportation.html
    ├── manufacturing.html
    ├── healthcare.html
    ├── data-centers.html
    └── municipal-government.html
```

### **11.2 Deleted Files**

```
/industries/mining-quarry.html — DELETE
```

### **11.3 Deprecated Paths (Redirect Only)**

```
/fuelcube/purchase-program.html
/fuelcube/*
/services/monitoring-fuel-management.html
/industries/hospitals-healthcare.html
/industries/mining-quarry.html
```

---

## **12\. Design Reference**

### **12.1 Color Palette**

| Name | Hex | Usage |
| ----- | ----- | ----- |
| Fox Fuel Red | \#C8102E | Primary buttons, CTAs, emergency, accent |
| Industrial Black | \#1A1A1A | Hero overlay, footer, dark sections |
| Slate Gray | \#2F2F2F | Proof bar, secondary backgrounds |
| Light Gray | \#E5E5E5 | Section backgrounds, secondary text |
| White | \#FFFFFF | Text on dark, card backgrounds |
| Diesel Blue | \#1F4E79 | Icons, optional accent |

### **12.2 Typography**

| Element | Font | Weight | Desktop | Mobile |
| ----- | ----- | ----- | ----- | ----- |
| H1 | Montserrat | Bold | 48px | 32px |
| H2 | Montserrat | Semibold | 36px | 28px |
| H3 | Montserrat | Semibold | 20px | 18px |
| Body | Open Sans | Regular | 16px | 16px |
| Small | Open Sans | Regular | 14px | 14px |
| Button | Montserrat | Semibold | 18px | 16px |

---

## **13\. Assets Required**

| Asset | Path | Notes |
| ----- | ----- | ----- |
| Fox Fuel logo (color) | `/assets/images/fox-fuel-logo.svg` | Header, primary use |
| Fox Fuel logo (white) | `/assets/images/fox-fuel-logo-white.svg` | Footer, dark backgrounds |
| Hero background | `/assets/images/hero-bg.jpg` | Industrial/truck imagery |
| Industry tiles (6) | `/assets/images/industry-*.jpg` | One per industry |
| Service imagery | `/assets/images/service-*.jpg` | Optional, operational |

---

## **14\. Final Execution Instruction**

This document is a **contract**, not guidance.

Claude Code must execute in one pass or halt with a report.

No external references are required. All content is contained within this document.

---

**End of Master Specification**

**Document:** pro.foxfuel.com — Master Subdomain Implementation Specification (v1.4) **Status:** Locked **Action:** Hand to Claude Code for execution

