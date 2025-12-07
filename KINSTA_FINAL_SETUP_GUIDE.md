# Kinsta Static Site Setup - Final Instructions
## Fox Fuel Pro - pro.foxfuel.com

**Repository:** `https://github.com/dynamix77/foxfuel-pro-site`  
**Branch:** `main`

---

## Step 1: Connect GitHub Account in MyKinsta

1. Log in to [MyKinsta](https://my.kinsta.com)
2. Navigate to **Static Sites** in the left sidebar
3. If this is your first time connecting GitHub:
   - Click **Add a site** or **Add service** → **Static Site**
   - Select **GitHub** as the source
   - Click **Authorize** or **Connect GitHub**
   - Authorize Kinsta to access your GitHub account
   - Grant access to repositories (or select specific repositories)

---

## Step 2: Create New Static Site

1. In MyKinsta, click **Add a site** or **Add service** → **Static Site**
2. Select **GitHub** as the source (if not already selected)
3. Select the repository: **`foxfuel-pro-site`** (from `dynamix77` account)
4. Select branch: **`main`**

---

## Step 3: Configure Build Settings

Configure the following:

- **Build command:** *(leave completely blank - no build step required)*
- **Publish directory:** `/` *(forward slash only - this is the repository root)*
- **Node version:** *(leave as default - not applicable for static site)*

**Important:** Do not enter anything in the build command field. This is a pure static site with no build process.

---

## Step 4: Deploy and Verify Temporary URL

1. Click **Deploy** or **Create site**
2. Wait for deployment to complete (typically 1-2 minutes)
3. Kinsta will provide a default static site URL (format: `your-site-12345.kinsta.cloud`)

### Verification Checklist:

Test the following URLs on the temporary Kinsta domain:

- [ ] **Homepage:** `https://your-site-12345.kinsta.cloud/`
  - Page loads without errors
  - Logo displays correctly
  - Navigation menu works

- [ ] **Services Page:** `https://your-site-12345.kinsta.cloud/services/fleet-fueling/`
  - Page loads correctly
  - Header navigation works
  - Images display

- [ ] **Industry Page:** `https://your-site-12345.kinsta.cloud/industries/construction/`
  - Page loads correctly
  - Content displays properly

- [ ] **FuelCube Page:** `https://your-site-12345.kinsta.cloud/fuelcube/models/`
  - Page loads correctly
  - Product information displays

- [ ] **Browser Console Check:**
  - Open Developer Tools (F12)
  - Check Console tab - should have no errors
  - Check Network tab - all assets should load (status 200)

If all pages load correctly, proceed to Step 5.

---

## Step 5: Add Custom Domain pro.foxfuel.com

1. In your Kinsta Static Site dashboard, go to **Domains** section
2. Click **Add domain** or **Add custom domain**
3. Enter: **`pro.foxfuel.com`**
4. Click **Add domain** or **Continue**

### DNS Configuration

Kinsta will display the DNS record you need to add. It will look like this:

**DNS Record to Add at Your DNS Provider:**

- **Type:** `CNAME`
- **Host/Name:** `pro`
- **Value/Target:** `[Kinsta hostname]` *(Kinsta will provide this - format: `your-site-12345.kinsta.cloud`)*
- **TTL:** `3600` (or use your DNS provider's default)

**Example:**
```
Type: CNAME
Name: pro
Target: your-site-12345.kinsta.cloud
TTL: 3600
```

### Add DNS Record at Your DNS Provider

1. Log in to your DNS provider for `foxfuel.com` domain
2. Navigate to DNS management / DNS records
3. Add a new CNAME record with the values Kinsta provided:
   - **Host/Name:** `pro`
   - **Type:** `CNAME`
   - **Value/Target:** `[exact Kinsta hostname from Step 5]`
   - **TTL:** `3600` (or default)

4. Save the DNS record

### Wait for DNS Propagation

- DNS changes typically propagate within 1-24 hours
- You can check propagation status:
  - Command line: `nslookup pro.foxfuel.com` or `dig pro.foxfuel.com CNAME`
  - Online: [whatsmydns.net](https://www.whatsmydns.net)

### SSL Certificate

- Kinsta will automatically issue an SSL certificate once DNS is verified
- SSL typically activates within 15-30 minutes after DNS verification
- You'll receive a notification in MyKinsta when SSL is active
- No manual SSL configuration required

---

## Step 6: Final Verification on Custom Domain

Once DNS has propagated and SSL is active:

1. Visit `https://pro.foxfuel.com`
2. Verify:
   - [ ] Homepage loads correctly
   - [ ] HTTPS is active (green lock icon)
   - [ ] All pages tested in Step 4 work on the custom domain
   - [ ] No mixed content warnings
   - [ ] Browser console shows no errors

---

## Deployment Complete ✅

Your site is now live at: **`https://pro.foxfuel.com`**

---

## Ongoing Updates

To update the site:

```bash
cd E:\FINAL_B2B_WEBSITE\deploy_root
git add .
git commit -m "Describe your changes"
git push
```

Kinsta will automatically redeploy on push to `main` branch (typically 1-3 minutes).

---

## Support

- **Kinsta Support:** Available 24/7 via MyKinsta dashboard
- **Documentation:** [Kinsta Static Sites Docs](https://kinsta.com/docs/static-site-hosting/)

