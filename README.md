# FindMyHorse - Static HTML Version

A static HTML version of the FindMyHorse landing page - the world's first unified equestrian marketplace.

## Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Parallax Hero Section** - Beautiful background with horse imagery
- **Interactive Elements** - Smooth scrolling navigation and button interactions
- **Horse Showcase** - Display of sample horses from around the world
- **Platform Integration** - Information about connecting global horse platforms
- **SEO Optimized** - Complete meta tags and semantic HTML structure

## How to Use

### Option 1: Open Directly
Simply double-click the `index.html` file to open it in your web browser.

### Option 2: Local Server
For better performance and testing, serve it locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have it installed)
npx http-server .
```

Then open `http://localhost:8000` in your browser.

### Option 3: Deploy
Upload the `index.html` file to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- Any web hosting provider

## Project Structure

```
mern/
├── index.html          # Main HTML file with all code
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or dependencies
- **Self-contained** - All styles and scripts are embedded
- **Optimized Images** - Uses external CDN images for performance
- **Cross-browser Compatible** - Works in all modern browsers

## Customization

All code is contained in the single `index.html` file. You can:
- Edit the horse data in the HTML structure
- Modify styles in the `<style>` section
- Update JavaScript functionality in the `<script>` section
- Replace images by updating the `src` attributes

## Original Angular Version

This static HTML version was converted from an Angular application, preserving all the visual design and functionality while removing the framework dependency.
