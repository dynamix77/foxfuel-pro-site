# Quick Reference Guide - Finding Your Images

## 🔍 How to Find Images in the New Structure

### Method 1: Browse by Category

**Need a FuelCube image?**
→ `assets_renamed/fuelcubes/`

**Need an industry jobsite photo?**
→ `assets_renamed/jobsites/`

**Need equipment photos (pumps, hoses, etc.)?**
→ `assets_renamed/equipment/`

**Need compliance labels or certifications?**
→ `assets_renamed/compliance/`

**Need the Fox Fuel logo?**
→ `assets_renamed/branding/`

**Need delivery truck photos?**
→ `assets_renamed/trucks/`

**Need UI elements (backgrounds, icons)?**
→ `assets_renamed/ui/`

---

### Method 2: Search by Old Filename

If you know the old filename, use the CSV mapping:

1. Open `assets_renamed/image-mapping.csv`
2. Find the old filename in the `original_filename` column
3. Look at the `new_path` column for the new location

**Example:**
```
Old: unnamed (1).jpg
New: assets_renamed/fuelcubes/fuelcube-double-wall-tank-red-cabinet-01.jpg
```

---

### Method 3: Search by Content Description

All filenames are now descriptive. Use your file explorer's search:

**Looking for construction sites?**
→ Search for "construction"

**Looking for 1000-gallon tanks?**
→ Search for "1000gal"

**Looking for UL142 certification labels?**
→ Search for "ul142"

**Looking for homepage UI elements?**
→ Search for "homepage"

---

## 📋 Common Image Lookups

### Industry Photos
| Industry | Filename |
|----------|----------|
| Agriculture | `jobsite-agriculture-field-equipment-01.jpg` |
| Airports | `jobsite-airport-ground-service-tarmac-01.jpg` |
| Bus Companies | `jobsite-bus-company-fleet-yard-01.jpg` |
| Car Dealerships | `jobsite-car-dealership-lot-aerial-01.jpg` |
| Construction | `jobsite-construction-excavator-site-01.jpg` |
| Data Centers | `jobsite-data-center-server-room-01.jpg` |
| Healthcare | `jobsite-hospital-healthcare-facility-01.jpg` |
| Marinas | `jobsite-marina-boats-dock-01.jpg` |
| Manufacturing | `jobsite-manufacturing-industrial-facility-01.jpg` |
| Mining | `jobsite-mining-quarry-excavation-01.jpg` |
| Municipalities | `jobsite-municipality-city-services-01.jpg` |
| Power Plants | `jobsite-power-plant-energy-facility-01.jpg` |
| Scrap Metal | `jobsite-scrap-metal-recycling-yard-01.jpg` |
| Taxi/Fleet | `jobsite-taxi-fleet-vehicles-01.jpg` |
| Truck Stops | `jobsite-truck-stop-fueling-station-01.jpg` |

### FuelCube Products
| Type | Filename |
|------|----------|
| 1000-gal tanks | `fuelcube-1000gal-white-tank-jobsite-01.jpg` |
| 990-gal tanks | `fuelcube-990gal-double-wall-tank-spec-01.jpg` |
| Double-wall tanks | `fuelcube-double-wall-tank-red-cabinet-01.jpg` |
| Construction site | `fuelcube-portable-tank-construction-site-01.jpg` |
| AI renders | `fuelcube-portable-tank-jobsite-render-01.png` (through 08) |

### Homepage UI Elements
| Element | Filename |
|---------|----------|
| Hero background | `ui-homepage-hero-background-gradient-01.png` |
| Advantages section | `ui-homepage-advantages-section-background-01.png` |
| Industries section | `ui-homepage-industries-section-background-01.png` |
| Uptime icon | `ui-homepage-advantage-icon-uptime-01.png` |
| Service icon | `ui-homepage-advantage-icon-service-01.png` |
| Compliance icon | `ui-homepage-advantage-icon-compliance-01.png` |
| Safety icon | `ui-homepage-advantage-icon-safety-01.png` |

### Compliance & Certifications
| Type | Filename |
|------|----------|
| UL142 labels | `compliance-ul142-certification-label-01.jpg` |
| Data plates | `compliance-tank-data-plate-specifications-01.jpg` |
| Safety warnings | `compliance-safety-warning-labels-01.jpg` |
| Certification plates | `compliance-tank-certification-plate-01.jpg` |

---

## 🔄 Old → New Filename Quick Reference

### Most Common Conversions

```
unnamed.jpg              → jobsite-truck-stop-fueling-station-02.jpg
unnamed (1).jpg          → fuelcube-double-wall-tank-red-cabinet-01.jpg
unnamed (2).jpg          → equipment-fuel-pump-dispenser-cabinet-01.jpg
unnamed (3).jpg          → fuelcube-portable-tank-construction-site-01.jpg
unnamed (9).jpg          → compliance-ul142-tank-label-certification-01.jpg
unnamed (14).jpg         → truck-fox-fuel-delivery-vehicle-branded-01.jpg

12unnamed.jpg            → fuelcube-1000gal-white-tank-jobsite-01.jpg

Agriculture.jpg          → jobsite-agriculture-field-equipment-01.jpg
Construction.jpg         → jobsite-construction-excavator-site-01.jpg
Manufacturing.jpg        → jobsite-manufacturing-industrial-facility-01.jpg

logo_main.png            → branding-fox-fuel-logo-main-01.png

Gemini_Generated_...     → fuelcube-portable-tank-jobsite-render-01.png

homepage/home_hero_...   → ui-homepage-hero-background-gradient-01.png
homepage/home_advantage_1 → ui-homepage-advantage-icon-uptime-01.png
```

---

## 💡 Pro Tips

1. **Use the CSV for bulk lookups** - Open in Excel/Sheets for easy filtering
2. **Search by category prefix** - All files start with their category name
3. **Sequential numbers** - If you need multiple similar images, check the sequence (01, 02, 03...)
4. **Descriptive names** - Filenames tell you what's in the image without opening it

---

## 📞 Need Help?

- **Full inventory:** See `README.md`
- **Complete mapping:** See `image-mapping.csv`
- **Detailed report:** See `COMPLETION_REPORT.md`
- **Quick summary:** See `SUMMARY.txt`
