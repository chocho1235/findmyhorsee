# FindMyHorse - Static Frontend

A beautiful static landing page for the FindMyHorse equestrian marketplace.

## 🚀 Development

### Quick Start
```bash
cd angular-client
npm install
npm run dev
```

This will start the development server at http://localhost:4200 with live reload.

### Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run start` - Same as dev (alias)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run watch` - Build and watch for changes

## 📦 Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/angular-client/browser/` directory.

## 🌐 Deployment

Since this is a static frontend, you can deploy the built files to any static hosting service:

- **Netlify**: Drag and drop the `dist/angular-client/browser` folder
- **Vercel**: Connect your GitHub repo and deploy
- **GitHub Pages**: Use the built files
- **Any web server**: Serve the files from `dist/angular-client/browser`

## 📱 Features

- ✅ Responsive design
- ✅ Modern Angular 20 
- ✅ TypeScript support
- ✅ Stock horse images for hero section
- ✅ Full-width hero with parallax effect
- ✅ Mobile-optimized
- ✅ SEO-friendly
- ✅ Fast loading

## 🎨 Customization

Edit files in `src/app/landing-page/` to customize:
- `landing-page.html` - Content and structure
- `landing-page.css` - Styling
- `landing-page.ts` - Functionality

## 🔧 No Backend Required

This is a static frontend only. All data is hardcoded in the component for demonstration purposes.
