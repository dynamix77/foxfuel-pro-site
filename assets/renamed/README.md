# Fox Fuel B2B Digital Asset Library

## Overview
This directory contains the **canonical, standardized asset library** for the Fox Fuel B2B website. All images have been systematically inspected, categorized, and renamed with descriptive filenames that reflect their actual content.

---

## 📁 Directory Structure

```
assets_renamed/
├── branding/          # Fox Fuel logos, brand marks, icons
├── compliance/        # Certification labels, safety warnings, data plates
├── equipment/         # Fuel pumps, dispensers, hoses, cabinets, valves
├── fuelcubes/         # FuelCube tanks, portable fuel storage systems
├── jobsites/          # Industry-specific jobsite and facility photos
├── personnel/         # Staff, technicians, team photos (currently empty)
├── trucks/            # Fox Fuel delivery vehicles and tankers
├── ui/                # Website UI elements, backgrounds, icons, cards
└── misc/              # Uncategorized or ambiguous assets (currently empty)
```

---

## 📊 Asset Distribution

| Category    | Count | Description                                    |
|-------------|-------|------------------------------------------------|
| **Branding**    | 1     | Fox Fuel logo and brand assets                 |
| **Compliance**  | 8     | UL142 labels, certifications, safety warnings  |
| **Equipment**   | 13    | Fuel pumps, dispensers, valves, hoses          |
| **FuelCubes**   | 24    | Portable fuel tanks, storage systems           |
| **Jobsites**    | 17    | Industry-specific facility and site photos     |
| **Personnel**   | 0     | Team and staff photos (none currently)         |
| **Trucks**      | 2     | Fox Fuel delivery vehicles                     |
| **UI**          | 13    | Homepage backgrounds, icons, service cards     |
| **Misc**        | 0     | Uncategorized assets (none currently)          |
| **TOTAL**       | **78**    | **Total organized assets**                     |

---

## 🏷️ Naming Convention

All files follow this standardized naming pattern:

```
category_subject_detail_seq.extension
```

### Rules:
- **All lowercase**
- **Hyphens** between words (no spaces or underscores)
- **Sequential numbering** with zero-padding (01, 02, 03...)
- **Descriptive subjects** that reflect actual visual content
- **Unique filenames** across the entire library

### Examples:
```
fuelcube-1000gal-jobsite-placement-01.jpg
truck-foxfuel-delivery-arrival-02.jpg
jobsite-construction-excavator-03.png
branding-fox-fuel-logo-main-01.png
compliance-ul142-certification-label-01.jpg
equipment-fuel-pump-dispenser-cabinet-01.jpg
ui-homepage-hero-background-gradient-01.png
```

---

## 📋 Image Mapping

The complete mapping from old filenames to new canonical names is available in:

**`image-mapping.csv`**

This CSV contains:
- `original_filename` - The old filename
- `original_path` - Original relative path
- `new_filename` - New descriptive filename
- `new_path` - New canonical path in assets_renamed/

---

## 🔄 Migration Status

### ✅ Completed:
- [x] All 78 images inspected and categorized
- [x] Descriptive filenames generated
- [x] Canonical folder structure created
- [x] Images copied and organized
- [x] CSV mapping file created
- [x] Code references scanned and updated
- [x] Original files preserved (not deleted)

### 📍 Code References Updated:
- **1 file** updated with new image paths
- **1 replacement** made
- See `update_log.txt` for details

---

## 🚀 Usage Guidelines

### For Developers:
1. **Always use paths from `assets_renamed/`** for new code
2. **Reference the CSV** to find new paths for old filenames
3. **Follow the naming convention** when adding new assets
4. **Categorize properly** - use existing folders or create new ones if needed

### For Content Creators:
1. **Browse by category** to find relevant assets
2. **Use descriptive filenames** to quickly identify content
3. **Check the CSV** if you need to find where an old image went
4. **Add new images** following the established naming pattern

---

## 📝 File Inventory

### Branding (1)
- `branding-fox-fuel-logo-main-01.png`

### Compliance (8)
- `compliance-ul142-tank-label-certification-01.jpg`
- `compliance-tank-data-plate-specifications-01.jpg`
- `compliance-ul142-certification-label-01.jpg`
- `compliance-tank-nameplate-details-01.jpg`
- `compliance-safety-warning-labels-01.jpg`
- `compliance-tank-certification-plate-01.jpg`
- `compliance-product-identification-label-01.jpg`
- `compliance-safety-instructions-label-01.jpg`

### Equipment (13)
- `equipment-fuel-pump-dispenser-cabinet-01.jpg`
- `equipment-fuel-hose-nozzle-closeup-01.jpg`
- `equipment-fuel-pump-cabinet-red-01.jpg`
- `equipment-fuel-dispenser-pump-system-01.jpg`
- `equipment-fuel-cabinet-pump-system-01.jpg`
- `equipment-fuel-pump-cabinet-installation-01.jpg`
- `equipment-tank-gauge-monitor-system-01.jpg`
- `equipment-fuel-filter-assembly-01.jpg`
- `equipment-tank-valve-assembly-01.jpg`
- `equipment-fuel-line-connections-01.jpg`
- `equipment-tank-vent-system-01.jpg`
- `equipment-fuel-dispenser-hose-assembly-01.jpg`
- `equipment-tank-mounting-bracket-01.jpg`

### FuelCubes (24)
- `fuelcube-portable-tank-jobsite-render-01.png` through `08.png` (AI renders)
- `fuelcube-1000gal-white-tank-jobsite-01.jpg`
- `fuelcube-double-wall-tank-red-cabinet-01.jpg`
- `fuelcube-portable-tank-construction-site-01.jpg`
- `fuelcube-white-tank-industrial-setting-01.jpg`
- `fuelcube-portable-tank-construction-site-02.jpg`
- `fuelcube-1000gal-white-tank-jobsite-02.jpg`
- `fuelcube-portable-tank-white-outdoor-01.jpg`
- `fuelcube-double-wall-tank-industrial-01.jpg`
- `fuelcube-990gal-double-wall-tank-spec-01.jpg`
- `fuelcube-990gal-tank-front-view-01.jpg`
- `fuelcube-tank-control-panel-closeup-01.jpg`
- `fuelcube-tank-side-view-details-01.jpg`
- `fuelcube-tank-connection-ports-01.jpg`
- `fuelcube-tank-rear-view-details-01.jpg`
- `fuelcube-990gal-tank-full-view-02.jpg`
- `fuelcube-tank-top-view-vents-01.jpg`

### Jobsites (17)
- `jobsite-agriculture-field-equipment-01.jpg`
- `jobsite-airport-ground-service-tarmac-01.jpg`
- `jobsite-bus-company-fleet-yard-01.jpg`
- `jobsite-car-dealership-lot-aerial-01.jpg`
- `jobsite-construction-excavator-site-01.jpg`
- `jobsite-data-center-server-room-01.jpg`
- `jobsite-hospital-healthcare-facility-01.jpg`
- `jobsite-marina-boats-dock-01.jpg`
- `jobsite-manufacturing-industrial-facility-01.jpg`
- `jobsite-mining-quarry-excavation-01.jpg`
- `jobsite-municipality-city-services-01.jpg`
- `jobsite-power-plant-energy-facility-01.jpg`
- `jobsite-scrap-metal-recycling-yard-01.jpg`
- `jobsite-scrap-metal-recycling-yard-02.jpg`
- `jobsite-taxi-fleet-vehicles-01.jpg`
- `jobsite-truck-stop-fueling-station-01.jpg`
- `jobsite-truck-stop-fueling-station-02.jpg`

### Trucks (2)
- `truck-fox-fuel-delivery-vehicle-branded-01.jpg`
- `truck-fox-fuel-tanker-delivery-route-01.jpg`

### UI (13)
- `ui-homepage-hero-background-gradient-01.png`
- `ui-homepage-advantages-section-background-01.png`
- `ui-homepage-industries-section-background-01.png`
- `ui-homepage-advantage-icon-uptime-01.png`
- `ui-homepage-advantage-icon-service-01.png`
- `ui-homepage-advantage-icon-compliance-01.png`
- `ui-homepage-advantage-icon-safety-01.png`
- `ui-homepage-service-card-delivery-01.png`
- `ui-homepage-service-card-monitoring-01.png`
- `ui-homepage-service-card-maintenance-01.png`
- `ui-homepage-service-card-support-01.png`
- `ui-homepage-industry-card-aviation-01.png`
- `ui-homepage-industry-card-construction-01.png`

---

## 🔍 Finding Assets

### By Category:
Navigate to the appropriate folder based on what you need:
- Need a logo? → `branding/`
- Need a FuelCube photo? → `fuelcubes/`
- Need an industry scene? → `jobsites/`
- Need a UI element? → `ui/`

### By Old Filename:
1. Open `image-mapping.csv`
2. Search for the old filename
3. Find the new path in the `new_path` column

### By Content:
Use the descriptive filenames to search:
- Looking for construction sites? Search for "construction"
- Need compliance labels? Search for "compliance"
- Want delivery trucks? Search for "truck"

---

## ⚠️ Important Notes

1. **Original files are preserved** in their original locations
2. **Do not delete** the `assets_renamed/` folder
3. **Always use canonical paths** from this folder in production code
4. **Update the CSV** when adding new assets
5. **Follow naming conventions** to maintain consistency

---

## 📞 Support

For questions about asset organization or to request new categories:
- Review the naming convention above
- Check the CSV mapping file
- Consult the update log for reference changes

---

**Last Updated:** December 3, 2025  
**Total Assets:** 78  
**Categories:** 9 (7 active, 2 empty)  
**Status:** ✅ Complete and Production-Ready
