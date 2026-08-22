import { Product, Review } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "knife-sharpener",
    name: "3-Stage Professional Knife Sharpener",
    tagline: "Restore Dull Kitchen Knives to Razor-Sharpness in Seconds!",
    description: "Tired of struggling with blunt kitchen knives? This 3-stage professional knife sharpener features Ceramic, Coarse, and Fine slots to repair, restore, and polish your blades. Ergonomically designed with a non-slip rubber base, it provides maximum safety and professional culinary results right in your home.",
    originalPrice: 599,
    discountedPrice: 249,
    discountPercent: 58,
    imageUrl: "https://images.unsplash.com/photo-1594756297404-19c2049e3c23?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594756297404-19c2049e3c23?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "3-Slot Sharpening: Ceramic, Coarse, and Fine Rods",
      "Ergonomic Solid Grip Handle for Safe and Easy Operation",
      "Non-Slip Protective Base Safeguards Your Kitchen Counter",
      "Works on Both Stainless Steel and Iron Kitchen Knives",
      "Quick & Easy - Takes Only 3 to 5 Pulls to Sharpen",
      "Highly Durable ABS Plastic and Rustproof Construction"
    ],
    tag: "Best Seller",
    rating: 4.8,
    reviewCount: 1540,
    specs: {
      "Material": "Heavy-Duty ABS Plastic, Stainless Steel, Diamond/Tungsten/Ceramic Rods",
      "Weight": "180 Grams",
      "Sharpening Stages": "1. Prep (Diamond), 2. Sharpen (Tungsten), 3. Finish (Ceramic)",
      "Package Includes": "1 x 3-Stage Knife Sharpener",
      "Warranty": "6 Months Smart Supply Replacement Warranty"
    }
  },
  {
    id: "peeler-4in1",
    name: "Multifunctional 4-in-1 Vegetable & Fruit Peeler",
    tagline: "Slicer, Shredder, Peeler & Core Remover All-In-One Smart Tool!",
    description: "The ultimate prep companion for every kitchen. This 4-in-1 peeler easily handles hard vegetables, soft fruits, julienning, and even includes a built-in eye/core remover. Crafted with premium stainless steel blades that stay sharp forever, it speeds up your cooking prep by 3x.",
    originalPrice: 499,
    discountedPrice: 199,
    discountPercent: 60,
    imageUrl: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "4 Built-in Functions: Standard Peel, Julienne Shred, Soft Peel, and Core Removal",
      "Double-Sided Razor-Sharp Stainless Steel Blades",
      "Comfort-Fit Ergonomic Anti-Slip Grip Handle",
      "Perfect for Carrots, Potatoes, Apples, Cucumbers, and Citrus Fruits",
      "Dishwasher Safe and Rustproof Material",
      "Space-Saving Loop for Convenient Hanging Storage"
    ],
    tag: "Kitchen Must-Have",
    rating: 4.7,
    reviewCount: 890,
    specs: {
      "Material": "Premium Food-Grade ABS, High-Quality Stainless Steel Blades",
      "Weight": "85 Grams",
      "Functions": "Peeling, Julienning, Scraping, Eye-Removing",
      "Dimensions": "18.5 cm x 7.5 cm",
      "Package Includes": "1 x 4-in-1 Peeler"
    }
  },
  {
    id: "shoe-brush",
    name: "Multifunctional Liquid Shoe Cleaning Brush with Soap Dispenser",
    tagline: "Dispense Cleaning Soap On-Demand for Sparkling Clean Shoes!",
    description: "Stop wasting expensive cleaning gels! This innovative cleaning brush features an integrated liquid dispenser compartment. Simply fill it with laundry detergent or liquid soap, and press the soft silicone button to release lather exactly where you need it. High-density, ultra-soft bristles clean effectively without scratching delicate fabrics.",
    originalPrice: 699,
    discountedPrice: 150,
    discountPercent: 79,
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "Built-in 50ml Refillable Soap Storage Reservoir",
      "One-Touch Press Dispensation Mechanism",
      "High-Density Soft, Sturdy Bristles—No Fiber Damage",
      "Ergonomic Non-Slip Grip Handle",
      "Ideal for Shoes, Clothes, Sinks, Bathrooms, and Kitchen Corners",
      "Handy Hanging String for Quick Air-Drying"
    ],
    tag: "Trending",
    rating: 4.6,
    reviewCount: 1120,
    specs: {
      "Material": "Eco-Friendly ABS Plastic, Micro-Fiber Bristles",
      "Capacity": "50 ml Soap Reservoir",
      "Bristle Strength": "Soft-Medium (Scratch-Safe)",
      "Package Includes": "1 x Soap-Dispensing Cleaning Brush"
    }
  },
  {
    id: "desktop-mop",
    name: "Mini Foldable Self-Squeeze Desktop Mop",
    tagline: "Squeeze with a Single Pull—Wipe Liquid & Coffee Spills Instantly!",
    description: "Meet the smartest tabletop cleaner ever created. This ultra-compact mini mop features a highly absorbent eco-sponge head that locks in liquids, oil, and dust instantly. With its hands-free self-squeezing mechanism, you simply fold the handle to wring out the water entirely, keeping your hands perfectly dry.",
    originalPrice: 799,
    discountedPrice: 249,
    discountPercent: 69,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "100% Hands-Free Squeezing—Just Pull the Lever to Wring",
      "Ultra-Absorbent Biodegradable Sponge Head",
      "Compact, Foldable, and Lightweight Design",
      "Cleans Computer Desks, Kitchen Platforms, Window Tracks, and Mirrors",
      "Works Dry (for Dust) or Wet (for Liquid/Oil Spills)",
      "Stores Upright—Saves Countertop Space"
    ],
    tag: "Hot Release",
    rating: 4.7,
    reviewCount: 740,
    specs: {
      "Material": "Premium Eco-Friendly ABS Body, Absorbent PVA Sponge Head",
      "Weight": "150 Grams",
      "Size": "29.5 cm x 15.5 cm",
      "Mechanism": "Dual-Folding Self-Squeeze",
      "Package Includes": "1 x Mini Squeeze Mop Handle, 1 x Premium PVA Sponge Head"
    }
  },
  {
    id: "bottle-brush",
    name: "Silicone Bottle Cleaning Brush",
    tagline: "360° Deep-Cleaning Soft Silicone Bristles That Reach Every Bottom!",
    description: "Get rid of nasty odor-causing bacteria in baby bottles, thermo-flasks, and narrow mugs. Made of premium, food-grade silicone, this flexible brush reaches deep into tight spaces without causing any scratches. Unlike ordinary sponges, it dries in minutes, doesn't absorb bad smells, and lasts 10x longer.",
    originalPrice: 599,
    discountedPrice: 249,
    discountPercent: 58,
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "360° Circular Flexible Bristles Cleans Corners Effortlessly",
      "100% Food-Grade BPA-Free Hygienic Silicone",
      "Scratch-Safe Protection for Delicate Glass and Steel",
      "Ergonomic Long Handle for Narrow-Neck Bottle Access",
      "Dries Extremely Fast to Prevent Mold and Bacterial Growth",
      "Dishwasher Safe and Boil-Sterilization Friendly"
    ],
    tag: "Highly Hygienic",
    rating: 4.8,
    reviewCount: 680,
    specs: {
      "Material": "FDA-Approved Food Grade Platinum Silicone, Premium PP Handle",
      "Length": "32 cm",
      "Temperature Range": "-20°C to +120°C",
      "Package Includes": "1 x Silicone Bottle Brush"
    }
  },
  {
    id: "bestseller-combo",
    name: "Smart Supply Ultimate 5-in-1 Best Seller Combo",
    tagline: "Save Massive Money—Get All 5 Problem-Solving Tools in One Giant Pack!",
    description: "The absolute ultimate upgrade for your smart home! Why buy them separately when you can get the entire collection for an unbeatable discount? This super value combo includes the 3-Stage Knife Sharpener, 4-in-1 Peeler, Soap Dispensing Shoe Brush, Self-Squeeze Mini Desktop Mop, and the Silicone Bottle Cleaning Brush. Complete your smart kitchen checklist in one single go!",
    originalPrice: 2999,
    discountedPrice: 999,
    discountPercent: 66,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594756297404-19c2049e3c23?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80"
    ],
    features: [
      "1 x 3-Stage Professional Knife Sharpener",
      "1 x 4-in-1 Vegetable & Fruit Peeler",
      "1 x Multifunctional Liquid Shoe Brush with Dispenser",
      "1 x Mini Foldable Self-Squeeze Desktop Mop",
      "1 x Silicone Bottle Cleaning Brush",
      "Massive Savings of Over ₹2,000 + 100% Free Shipping"
    ],
    tag: "Super Value Combo",
    rating: 4.9,
    reviewCount: 2310,
    specs: {
      "Contents Included": "Sharpener, Peeler, Shoe Soap Brush, Mini Table Mop, Bottle Brush",
      "Shipping Fee": "₹0 (100% Free Shipping Included)",
      "Payment Method": "100% Cash on Delivery (COD) Supported",
      "Replacement Guarantee": "7-Day Hassle-Free Replacement Support"
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Anjali Menon",
    rating: 5,
    comment: "This 5-in-1 combo is the best money I have spent on my home this year! The knife sharpener made our old rusted scissors and knives brand new in 5 seconds. The mini desktop mop cleans tea stains perfectly. Best purchase!",
    date: "August 14, 2026",
    location: "Kochi, Kerala",
    verified: true
  },
  {
    id: "rev-2",
    author: "Rohan Das",
    rating: 5,
    comment: "Excellent quality! I was skeptical about ordering online but when the package arrived, I opened it and was shocked by how solid the soap-dispensing shoe brush is. The 4-in-1 peeler slices potato skin like absolute butter.",
    date: "August 10, 2026",
    location: "Kolkata, West Bengal",
    verified: true
  },
  {
    id: "rev-3",
    author: "Meenakshi S.",
    rating: 5,
    comment: "The silicone bottle brush fits my thermal bottles perfectly! No more smelly bottle corners. Free home delivery and Cash on Delivery is incredibly convenient. I will buy another set for my sister.",
    date: "August 07, 2026",
    location: "Chennai, Tamil Nadu",
    verified: true
  },
  {
    id: "rev-4",
    author: "Sinan",
    rating: 5,
    comment: "Sourcing genuine kitchen problem-solvers in Malabar was always hard. This 5-in-1 pack is a lifesaver. The knife sharpener and soap-dispensing cleaning brush are high quality. Fast delivery, paid with cash on delivery at Calicut!",
    date: "August 20, 2026",
    location: "Kozhikode, Kerala",
    verified: true
  }
];

export const FAQS = [
  {
    question: "How do I place an order with Cash on Delivery (COD)?",
    answer: "It is super simple! Just select your desired quantity, click the 'Order via Cash on Delivery' button, fill in your Name, Phone, Address, and Pincode, and click Confirm. You do not need to pay anything online. You pay cash only when the delivery agent hands over the package at your doorstep."
  },
  {
    question: "Are there any hidden shipping or COD charges?",
    answer: "Absolutely not! Delivery is 100% FREE across India for all orders on Smart Supply, with zero minimum price threshold. There are zero extra COD collection or handling fees. The amount you see in your order summary is the exact and final amount you pay at your doorstep."
  },
  {
    question: "How many days will it take for my order to arrive?",
    answer: "Most orders are processed and dispatched within 24 hours. Delivery takes 3 to 5 business days depending on your location. We deliver to over 19,000+ pin codes across India including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune, Hyderabad, and Tier-2/3 cities."
  },
  {
    question: "What if I receive a broken or damaged item?",
    answer: "Smart Supply offers a 7-day hassle-free replacement guarantee. If you receive a damaged, incomplete, or malfunctioning item, simply send a photo/video of the product to our WhatsApp support at +91 9946597203 or email us at smartsupply36@gmail.com. We will arrange a free brand-new replacement at your doorstep."
  },
  {
    question: "How do I track my order once placed?",
    answer: "Once your order is verified and dispatched, you will receive an automated tracking link on your WhatsApp/SMS. You can also chat directly with our WhatsApp support line (+91 9946597203) to ask about your dispatch status anytime."
  }
];
