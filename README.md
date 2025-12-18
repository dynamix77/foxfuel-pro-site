# Fox Fuel Pro Static Site

Production-ready static website for Fox Fuel Pro.

## 📁 Repository Structure

```
/
├── index.html                    # Homepage
├── services/                     # Service pages
│   ├── index.html               # Services hub
│   ├── bulk-fuel-delivery.html
│   ├── fleet-fueling.html
│   ├── jobsite-fueling.html
│   ├── generator-fueling.html
│   └── monitoring-fuel-management.html
├── industries/                   # Industry-specific pages
│   └── [15 industry pages]
├── fuelcube/                     # FuelCube product pages
│   ├── models.html
│   ├── compliance-safety.html
│   ├── placement-support.html
│   ├── purchase-program.html
│   └── rental-program.html
├── assets/                       # Static assets
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript
│   └── renamed/                 # Images
├── sitemap.xml                   # SEO sitemap
└── robots.txt                    # Search engine directives
```

## 🚀 Deployment

### Sevala Configuration

- **Build Command:** (none - static site)
- **Output Directory:** `/` (root)
- **Domain:** `pro.foxfuel.com`

### GitHub Repository

Repository: `foxfuel-pro-site`

**To push to GitHub:**

1. Create the repository on GitHub (name: `foxfuel-pro-site`, visibility: private)
2. Run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/foxfuel-pro-site.git
   git push -u origin main
   ```

## ✅ Pre-Deployment Checklist

- [x] All HTML files copied and renamed
- [x] Internal links fixed
- [x] Asset paths configured
- [x] Sitemap.xml included
- [x] Robots.txt included
- [x] Git repository initialized
- [ ] Assets folder copied (see DEPLOYMENT_INSTRUCTIONS.md)

## 📝 Notes

- Pure static site - no build step required
- All files are production-ready
- URLs use kebab-case format
- Asset paths are root-relative for deployment

