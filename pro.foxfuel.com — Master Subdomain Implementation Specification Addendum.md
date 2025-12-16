# **pro.foxfuel.com — Master Subdomain Implementation Specification**

## **v1.4.1 Addendum — Execution Guardrails (Non-Content)**

**Status:** Approved  
 **Scope:** Execution clarification only  
 **Authority:** Subordinate to v1.4, does not override content, routing, or governance rules  
 **Purpose:** Eliminate remaining execution ambiguity for Claude Code

---

## **A1. Source-of-Truth for “Modify” Pages**

For all pages marked **Action \= Modify** in Section 4 of v1.4:

* Claude Code **must be provided the existing pro.foxfuel.com codebase** (HTML, PHP, or template files) as the authoritative source for page body content.

* Existing body copy on Modify pages **must be preserved verbatim**, except as explicitly allowed below.

* Claude Code **must not fabricate, infer, or replace body paragraphs** on Modify pages.

**If the existing codebase is not provided, Claude Code must halt and report:**

“Modify pages require existing source files. Execution blocked.”

---

## **A2. Conflict Resolution Rule (Allowed Narrow Edits)**

If preserved body copy on a Modify page contains any of the following conflicts with v1.4 governance:

* Links to `foxfuel.com` or `www.foxfuel.com`

* Explicit residential-only routing language (for example “home heating customers”)

* CTA text that is explicitly prohibited in Section 8 (for example “Contact Us”, “Learn More”, “Get Started”)

Claude Code **may only** perform the following minimal corrections:

* Remove or replace the **link target** with the pro.foxfuel.com equivalent

* Remove the **CTA element only**, replacing it with the canonical “Request Quote” CTA

* Remove a single conflicting sentence **only if it is explicitly residential**

Claude Code **must not** rewrite surrounding paragraphs, tone, or structure.

---

## **A3. CTA Block Insertion Boundary**

For all pages requiring a CTA Block insertion:

* The CTA Block must be inserted **after the final body section** and **before the footer**

* If the page already contains a CTA region:

  * Replace it entirely with the canonical CTA Block defined in Section 3.4

* If the page does not contain a CTA region:

  * Append the CTA Block immediately before the footer

Claude Code must not guess alternate placements.

---

## **A4. Guardrails / Service Availability Placement**

For pages requiring guardrails or service availability sections:

* Insert the Guardrails or Service Availability section:

  * After the final functional content section

  * Before the CTA Block

* Do not merge guardrails into other sections

* Use **only** the exact templates defined in:

  * Section 6.6.2 (Service pages)

  * Section 6.7.2 (Industry pages)

---

## **A5. Header & Footer Implementation Constraint**

Claude Code must implement global navigation and footer using **one shared source**, wherever possible:

* Static sites: shared include or duplicated identical markup is acceptable

* WordPress/hybrid sites: use shared template parts if they exist

Claude Code must **not** create page-specific variants of navigation or footer.

---

## **A6. Asset Handling Rule**

If a required asset path defined in Section 13 does not exist in the codebase:

* Claude Code **may create an empty placeholder file** at the specified path

* Claude Code **must not substitute alternate imagery**

* Claude Code **must not remove image references**

This preserves layout integrity without violating the no-inference rule.

---

## **A7. Definition of “Finished” for This Spec**

For purposes of v1.4 execution, **“finished” means**:

* All pages exist per Section 4

* All content is implemented per Section 6

* All redirects function per Section 5

* Navigation, footer, CTAs, and forms are implemented

* Forms submit to stub handlers with TODO endpoints as defined

**Live CRM integration is explicitly out of scope** until Fox Fuel provides final endpoints.

---

## **A8. Halt Conditions (Hard Stop)**

Claude Code must halt and report if any of the following occur:

* Existing Modify-page source files are missing

* Conflicting instructions are detected between v1.4 and this addendum

* A required page, redirect, or component cannot be implemented without inference

* A validation checklist item fails

---

**End of v1.4.1 Addendum**

