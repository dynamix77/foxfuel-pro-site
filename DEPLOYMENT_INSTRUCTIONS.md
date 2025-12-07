# Fox Fuel Pro Site - Deployment Instructions

## ✅ Completed Steps

1. ✅ All production HTML files copied and renamed to kebab-case
2. ✅ Internal links fixed for deployment structure
3. ✅ Sitemap.xml and robots.txt copied
4. ✅ Git repository initialized

## ⚠️ Manual Step Required: Assets Folder

Due to Windows file permission issues, the assets folder needs to be copied manually:

### Option 1: Manual Copy (Recommended)
1. Open File Explorer
2. Navigate to: `E:\FINAL_B2B_WEBSITE\assets`
3. Copy the entire `assets` folder
4. Paste into: `E:\FINAL_B2B_WEBSITE\deploy_root\`
5. Ensure the structure is: `deploy_root\assets\css\`, `deploy_root\assets\js\`, `deploy_root\assets\renamed\`

### Option 2: Command Line (Run as Administrator)
```powershell
cd E:\FINAL_B2B_WEBSITE
robocopy assets deploy_root\assets /E /COPYALL /R:3 /W:5
```

## 📁 Final Structure

```
deploy_root/
├── index.html                    # Homepage
├── services/
│   ├── index.html               # Services hub
│   ├── bulk-fuel-delivery.html
│   ├── fleet-fueling.html
│   ├── jobsite-fueling.html
│   ├── generator-fueling.html
│   └── monitoring-fuel-management.html
├── industries/
│   ├── agriculture.html
│   ├── airports-ground-service.html
│   ├── bus-companies.html
│   ├── car-dealerships.html
│   ├── construction.html
│   ├── data-centers.html
│   ├── hospitals-healthcare.html
│   ├── manufacturing.html
│   ├── marinas.html
│   ├── mining-quarry.html
│   ├── municipalities.html
│   ├── power-plants.html
│   ├── scrap-metal.html
│   ├── taxi-companies.html
│   └── truck-stops.html
├── fuelcube/
│   ├── models.html
│   ├── compliance-safety.html
│   ├── placement-support.html
│   ├── purchase-program.html
│   └── rental-program.html
├── assets/
│   ├── css/
│   ├── js/
│   └── renamed/
├── sitemap.xml
└── robots.txt
```

## 🚀 GitHub Deployment

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `foxfuel-pro-site`
3. Visibility: **Private** (unless public is requested)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### 2. Push to GitHub

After creating the repo, run these commands in `deploy_root`:

```bash
cd E:\FINAL_B2B_WEBSITE\deploy_root
git add .
git commit -m "Initial commit: Fox Fuel Pro static site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foxfuel-pro-site.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 🌐 Sevala Deployment Configuration

### Build Settings
- **Build Command:** (none - static site)
- **Output Directory:** `/` (root)
- **Domain:** `pro.foxfuel.com`

### Notes
- This is a pure static site - no build step required
- All HTML files are production-ready
- Asset paths are configured for root-relative deployment
- Sitemap and robots.txt are included

## ✅ Validation Checklist

Before deploying, verify:
- [ ] Assets folder is copied (css, js, renamed subfolders)
- [ ] All HTML files load correctly
- [ ] Internal links work (test navigation)
- [ ] Images load (check browser console for 404s)
- [ ] CSS styles apply correctly
- [ ] JavaScript functions work
- [ ] Sitemap.xml is accessible
- [ ] robots.txt is accessible

## 🔗 URL Structure

- Homepage: `/` → `index.html`
- Services: `/services/` → `services/index.html`
- Service pages: `/services/bulk-fuel-delivery/` → `services/bulk-fuel-delivery.html`
- Industries: `/industries/construction/` → `industries/construction.html`
- FuelCube: `/fuelcube/models/` → `fuelcube/models.html`

All URLs use kebab-case and match the sitemap.xml structure.

