const fs = require('fs');
const path = require('path');

// Direct self-contained definition of the product metadata
const PRODUCTS = [
  {
    id: "knife-sharpener",
    name: "3-Stage Professional Knife Sharpener",
    tagline: "Restore Dull Kitchen Knives to Razor-Sharpness in Seconds!",
    imageUrl: "https://images.unsplash.com/photo-1594756297404-19c2049e3c23?w=800&auto=format&fit=crop&q=80",
    description: "Tired of struggling with blunt kitchen knives? This 3-stage professional knife sharpener features Ceramic, Coarse, and Fine slots to repair, restore, and polish your blades."
  },
  {
    id: "peeler-4in1",
    name: "Multifunctional 4-in-1 Vegetable & Fruit Peeler",
    tagline: "Slicer, Shredder, Peeler & Core Remover All-In-One Smart Tool!",
    imageUrl: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80",
    description: "The ultimate prep companion for every kitchen. This 4-in-1 peeler easily handles hard vegetables, soft fruits, julienning, and even includes a built-in eye/core remover."
  },
  {
    id: "shoe-brush",
    name: "Multifunctional Liquid Shoe Cleaning Brush with Soap Dispenser",
    tagline: "Dispense Cleaning Soap On-Demand for Sparkling Clean Shoes!",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    description: "Stop wasting expensive cleaning gels! This innovative cleaning brush features an integrated liquid dispenser compartment."
  },
  {
    id: "desktop-mop",
    name: "Mini Foldable Self-Squeeze Desktop Mop",
    tagline: "Squeeze with a Single Pull—Wipe Liquid & Coffee Spills Instantly!",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    description: "Meet the smartest tabletop cleaner ever created. This ultra-compact mini mop features a highly absorbent eco-sponge head that locks in liquids, oil, and dust instantly."
  },
  {
    id: "bottle-brush",
    name: "Silicone Bottle Cleaning Brush",
    tagline: "360° Deep-Cleaning Soft Silicone Bristles That Reach Every Bottom!",
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80",
    description: "Get rid of nasty odor-causing bacteria in baby bottles, thermo-flasks, and narrow mugs. Made of premium, food-grade silicone, this flexible brush reaches deep into tight spaces without causing any scratches."
  },
  {
    id: "2-item-combo",
    name: "Smart Supply Premium 2-Item Best Seller Combo",
    tagline: "Double the Efficiency—3-Stage Knife Sharpener + 4-in-1 Vegetable Peeler!",
    imageUrl: "https://images.unsplash.com/photo-1594756297404-19c2049e3c23?w=800&auto=format&fit=crop&q=80",
    description: "Get our top two best-selling, problem-solving smart kitchen tools in one super-saver package! This premium 2-item combo includes our legendary 3-Stage Professional Knife Sharpener and the Multifunctional 4-in-1 Vegetable & Fruit Peeler."
  },
  {
    id: "bestseller-combo",
    name: "Smart Supply Ultimate 5-in-1 Best Seller Combo",
    tagline: "Save Massive Money—Get All 5 Problem-Solving Tools in One Giant Pack!",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    description: "The absolute ultimate upgrade for your smart home! Why buy them separately when you can get the entire collection for an unbeatable discount?"
  }
];

function runPostBuild() {
  console.log('--- Post-Build Static Page Generation ---');
  
  const distPath = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: dist/index.html not found! Run vite build first.');
    return;
  }
  
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // 1. Generate real physical directory and index.html for each product
  PRODUCTS.forEach((product) => {
    // Generate both with trailing slash directory AND plain file paths to support all server schemes
    const productDir = path.join(distPath, 'products', product.id);
    
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    // Inject personalized SEO tags for social media previews
    let customHtml = indexHtmlContent;
    
    // Replace Title
    customHtml = customHtml.replace(/<title>.*?<\/title>/, `<title>${product.name} - Buy Cash on Delivery | Hovozon</title>`);
    
    // Inject custom meta tags
    const ogImageTags = `
    <meta property="og:title" content="${product.name}" />
    <meta property="og:description" content="${product.tagline || product.description}" />
    <meta property="og:image" content="${product.imageUrl}" />
    <meta name="twitter:image" content="${product.imageUrl}" />
    `;
    
    if (customHtml.includes('</head>')) {
      customHtml = customHtml.replace('</head>', `${ogImageTags}\n  </head>`);
    }
    
    fs.writeFileSync(path.join(productDir, 'index.html'), customHtml, 'utf8');
    
    // Also create a physical file products/[id].html in dist for platforms that rewrite products/id to products/id.html
    const productsParentDir = path.join(distPath, 'products');
    if (!fs.existsSync(productsParentDir)) {
      fs.mkdirSync(productsParentDir, { recursive: true });
    }
    fs.writeFileSync(path.join(productsParentDir, `${product.id}.html`), customHtml, 'utf8');
    
    console.log(`✅ Created permanent static route files for: ${product.id}`);
  });
  
  // 2. Generate physical directory and index.html for the Admin page
  const adminDir = path.join(distPath, 'admin');
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }
  fs.writeFileSync(path.join(adminDir, 'index.html'), indexHtmlContent, 'utf8');
  fs.writeFileSync(path.join(distPath, 'admin.html'), indexHtmlContent, 'utf8');
  console.log('✅ Created permanent static route files for: /admin');
  
  console.log('--- Static Routing Generation Completed Successfully ---');
}

runPostBuild();
