# Wedding Vendor Images

This directory contains curated, high-quality wedding-related images organized by vendor categories.

## Directory Structure

```
wedding/
├── bridal/           - Bridal styling, makeup, dresses (8 images)
├── catering/         - Food, beverages, wedding cakes (8 images)
├── decor/            - Flowers, decorations, table settings (8 images)
├── entertainment/    - Bands, DJs, performers (8 images)
├── photography/      - Photographers, videographers (8 images)
├── planning/         - Wedding planners, coordinators (4 images)
├── transportation/   - Wedding cars, limos (4 images)
├── venues/           - Wedding venues, halls, gardens (8 images)
└── hero-wedding-*.jpg - General wedding hero images (3 images)
```

## Image Mapping

The application automatically assigns images to vendors based on their category:

- **Photography & Videography** → `photography/` folder
- **Venues** → `venues/` folder
- **Bridal & Groom Styling** → `bridal/` folder
- **Fashion & Attire** → `bridal/` folder
- **Décor & Flowers** → `decor/` folder
- **Entertainment** → `entertainment/` folder
- **Food & Beverages** → `catering/` folder
- **Wedding Planning & Coordination** → `planning/` folder
- **Transportation** → `transportation/` folder
- **Stationery & Invitations** → `planning/` folder
- **Wedding Accessories & Extras** → `decor/` folder
- **Gifts & Souvenirs** → `catering/` folder
- **Technology Services** → `photography/` folder
- **Logistics & Support Services** → `planning/` folder
- **Religious / Cultural Services** → `venues/` folder
- **Post-Wedding Services** → `planning/` folder

## Image Sources

All images are high-quality, royalty-free photos from Unsplash, optimized for web display (800px width, 80% quality).

## Total Size

~5.5MB (62 images total)

## Usage

Images are automatically assigned to vendors through the `getVendorImage()` function in `src/data-wedding.ts`, which rotates through available images for each category.




