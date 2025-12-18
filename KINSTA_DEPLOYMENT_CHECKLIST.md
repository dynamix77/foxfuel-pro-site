# Kinsta Static Site Deployment Checklist
## Fox Fuel Pro - pro.foxfuel.com

---

## 1. Repository Confirmation

### ✅ Verify GitHub Repository
- [ ] Confirm GitHub repository URL: `https://github.com/dynamix77/foxfuel-pro-site`
- [ ] Confirm branch: `main`
- [ ] Confirm `index.html` exists at repository root
- [ ] Confirm `assets/` folder structure:
  - [ ] `assets/css/sitewide_styles_PRODUCTION.css`
  - [ ] `assets/js/site_interactions_PRODUCTION.js`
  - [ ] `assets/renamed/` (images folder)
- [ ] Confirm folders exist:
  - [ ] `services/`
  - [ ] `industries/`
  - [ ] `fuelcube/`
- [ ] Confirm root files:
  - [ ] `sitemap.xml`
  - [ ] `robots.txt`

---

## 2. Kinsta Static Site Configuration

### Step 2.1: Create New Static Site
1. Log in to [MyKinsta](https://my.kinsta.com)
2. Navigate to **Static Sites** in the left sidebar
3. Click **Add a site** or **Add service** → **Static Site**

### Step 2.2: Connect GitHub Repository
1. Select **GitHub** as the source
2. Authorize Kinsta to access your GitHub account (if not already authorized)
3. Select the repository: `foxfuel-pro-site`
4. Select branch: **main**

### Step 2.3: Build Settings
Configure the following settings:

- **Build command:** *(leave blank - no build step required)*
- **Publish directory:** `/` *(root directory - where index.html lives)*
- **Node version:** *(not applicable - static site)*

### Step 2.4: Deploy
1. Click **Deploy** or **Create site**
2. Wait for deployment to complete (typically 1-2 minutes)
3. Kinsta will provide a default static site URL (e.g., `your-site-12345.kinsta.cloud`)
4. **Verify the default URL loads correctly:**
   - [ ] Homepage loads at default Kinsta URL
   - [ ] No console errors for missing assets
   - [ ] CSS styles apply correctly
   - [ ] Navigation links work

---

## 3. Custom Domain: pro.foxfuel.com

### Step 3.1: Add Custom Domain in Kinsta
1. In your Kinsta Static Site dashboard, go to **Domains**
2. Click **Add domain** or **Add custom domain**
3. Enter: `pro.foxfuel.com`
4. Click **Add domain**

### Step 3.2: Configure DNS Record
Kinsta will display the DNS configuration needed. It will look like:

**DNS Record to Add:**
- **Type:** `CNAME`
- **Name:** `pro`
- **Target:** `your-site-12345.kinsta.cloud` *(Kinsta will provide the exact hostname)*
- **TTL:** `3600` (or use your DNS provider's default)

### Step 3.3: Add DNS Record in Your DNS Provider
1. Log in to your DNS provider for `foxfuel.com`
2. Navigate to DNS management
3. Add a new CNAME record:
   - **Host/Name:** `pro`
   - **Type:** `CNAME`
   - **Value/Target:** `[Kinsta hostname from Step 3.2]`
   - **TTL:** `3600` (or default)

4. Save the DNS record

### Step 3.4: Wait for DNS Propagation
- DNS changes typically propagate within 1-24 hours
- You can check propagation status using tools like:
  - `nslookup pro.foxfuel.com`
  - `dig pro.foxfuel.com CNAME`
  - Online tools: whatsmydns.net

### Step 3.5: SSL Certificate
- [ ] Kinsta will automatically issue an SSL certificate once DNS is verified
- [ ] SSL certificate typically activates within 15-30 minutes after DNS verification
- [ ] You'll receive a notification in MyKinsta when SSL is active
- [ ] No manual SSL configuration required

---

## 4. Post Go-Live Validation

### Step 4.1: Homepage Verification
Visit `https://pro.foxfuel.com` and verify:
- [ ] Homepage loads without errors
- [ ] Logo displays correctly
- [ ] Navigation menu is functional
- [ ] Hero section displays properly
- [ ] No 404 errors in browser console (F12 → Console tab)
- [ ] CSS styles are applied correctly
- [ ] Images load (check Network tab if needed)

### Step 4.2: Services Pages Verification
Test the following service pages:
- [ ] `https://pro.foxfuel.com/services/` (Services hub)
- [ ] `https://pro.foxfuel.com/services/bulk-fuel-delivery/`
- [ ] `https://pro.foxfuel.com/services/fleet-fueling/`
- [ ] `https://pro.foxfuel.com/services/jobsite-fueling/`
- [ ] `https://pro.foxfuel.com/services/generator-fueling/`
- [ ] `https://pro.foxfuel.com/services/monitoring-fuel-management/`

For each page, verify:
- [ ] Page loads without errors
- [ ] Header navigation works
- [ ] Footer links resolve
- [ ] Images display correctly
- [ ] No broken asset references

### Step 4.3: Industries Pages Verification
Test several industry pages:
- [ ] `https://pro.foxfuel.com/industries/construction/`
- [ ] `https://pro.foxfuel.com/industries/municipalities/`
- [ ] `https://pro.foxfuel.com/industries/taxi-companies/`
- [ ] `https://pro.foxfuel.com/industries/agriculture/`
- [ ] `https://pro.foxfuel.com/industries/data-centers/`

For each page, verify:
- [ ] Page loads correctly
- [ ] Navigation is consistent
- [ ] Industry-specific content displays
- [ ] No console errors

### Step 4.4: FuelCube Pages Verification
Test FuelCube product pages:
- [ ] `https://pro.foxfuel.com/fuelcube/models/`
- [ ] `https://pro.foxfuel.com/fuelcube/compliance-safety/`
- [ ] `https://pro.foxfuel.com/fuelcube/placement-support/`
- [ ] `https://pro.foxfuel.com/fuelcube/purchase-program/`
- [ ] `https://pro.foxfuel.com/fuelcube/rental-program/`

For each page, verify:
- [ ] Page loads correctly
- [ ] Product information displays
- [ ] Images and graphics load
- [ ] Navigation works

### Step 4.5: Cross-Page Navigation
- [ ] Click through header navigation on multiple pages
- [ ] Verify footer links work
- [ ] Test internal links within content
- [ ] Confirm breadcrumbs (if present) work correctly

### Step 4.6: Technical Validation
- [ ] Open browser Developer Tools (F12)
- [ ] Check Console tab for JavaScript errors (should be empty or minimal)
- [ ] Check Network tab - verify all assets load (status 200)
- [ ] Verify `sitemap.xml` is accessible: `https://pro.foxfuel.com/sitemap.xml`
- [ ] Verify `robots.txt` is accessible: `https://pro.foxfuel.com/robots.txt`
- [ ] Test on mobile device or browser responsive mode
- [ ] Verify HTTPS is enforced (no mixed content warnings)

---

## 5. Ongoing Update Workflow

### To Update the Site:

1. **Make Changes Locally**
   - Edit files in `E:\FINAL_B2B_WEBSITE\deploy_root`
   - Test changes locally if possible

2. **Commit and Push**
   ```bash
   cd E:\FINAL_B2B_WEBSITE\deploy_root
   git status
   git add .
   git commit -m "Describe your changes here"
   git push
   ```

3. **Kinsta Auto-Deployment**
   - Kinsta will automatically detect the push to `main` branch
   - Deployment will start automatically (typically within 1-2 minutes)
   - You'll see deployment status in MyKinsta dashboard
   - Deployment typically completes in 1-3 minutes
   - No manual trigger required

4. **Verify Deployment**
   - Check MyKinsta dashboard for deployment status
   - Visit `https://pro.foxfuel.com` to verify changes are live
   - Check browser console for any new errors

### Rollback (if needed)
- In MyKinsta, go to your Static Site → **Deployments**
- Find the previous successful deployment
- Click **Redeploy** to rollback to that version

---

## 6. Important Notes

### Build Configuration
- **No build command required** - this is a pure static site
- **Publish directory is `/`** - the repository root where `index.html` lives
- All HTML files are production-ready and require no processing

### URL Structure
- Homepage: `https://pro.foxfuel.com/` → `index.html`
- Services: `https://pro.foxfuel.com/services/` → `services/index.html`
- Service pages: `https://pro.foxfuel.com/services/bulk-fuel-delivery/` → `services/bulk-fuel-delivery.html`
- Industries: `https://pro.foxfuel.com/industries/construction/` → `industries/construction.html`
- FuelCube: `https://pro.foxfuel.com/fuelcube/models/` → `fuelcube/models.html`

### Asset Paths
- All asset paths are configured for root-relative deployment
- CSS: `/assets/css/`
- JavaScript: `/assets/js/`
- Images: `/assets/renamed/`

### Support
- Kinsta Support: Available 24/7 via MyKinsta dashboard
- Documentation: [Kinsta Static Sites Docs](https://kinsta.com/docs/static-site-hosting/)

---

## Deployment Complete ✅

Once all checklist items are verified, your site is live and ready for production traffic.

**Site URL:** `https://pro.foxfuel.com`

