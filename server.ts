import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { PRODUCTS } from "./src/data";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // API endpoint for COD Order confirmation with Telegram Bot API integration
  app.post("/api/confirm-order", async (req, res) => {
    try {
      const { name, phone, address, pincode, productName, quantity, totalPrice, timestamp } = req.body;

      // Basic backend validation
      if (!name || !phone || !address || !pincode || !productName || !quantity || !totalPrice) {
        res.status(400).json({
          success: false,
          message: "Please fill all required fields correctly."
        });
        return;
      }

      const orderId = `SS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      const hasTelegramConfig = !!(
        botToken && 
        chatId && 
        botToken !== "YOUR_TELEGRAM_BOT_TOKEN" && 
        chatId !== "YOUR_TELEGRAM_CHAT_ID" && 
        botToken.trim() !== "" && 
        chatId.trim() !== ""
      );

      // 1. Send to Telegram if configured
      if (hasTelegramConfig) {
        // Build beautiful Markdown message for Telegram
        const telegramMessage = [
          "📦 *NEW SMART SUPPLY COD ORDER!*",
          "━━━━━━━━━━━━━━━━━━",
          `🛍️ *Product:* ${productName}`,
          `🔢 *Quantity:* ${quantity}`,
          `💵 *Total Amount:* ₹${totalPrice}`,
          "━━━━━━━━━━━━━━━━━━",
          `👤 *Customer:* ${name}`,
          `📞 *Phone:* ${phone}`,
          `📍 *Address:* ${address}`,
          `📮 *Pincode:* ${pincode}`,
          `⏰ *Time:* ${timestamp}`,
          `🆔 *Order ID:* \`${orderId}\``
        ].join("\n");

        try {
          if (typeof fetch !== "undefined") {
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await fetch(telegramUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: "Markdown"
              })
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              console.error("Telegram API returned an error:", errData);
            } else {
              console.log(`[Telegram] Successfully sent Order ${orderId} message.`);
            }
          } else {
            console.warn("[Telegram Backup] global fetch is not defined in this Node.js runtime. Unable to send to Telegram.");
          }
        } catch (telegramErr) {
          console.error("Failed to forward message to Telegram:", telegramErr);
        }
      }

      if (!hasTelegramConfig) {
        console.log("----------------------------------------");
        console.log("NEW ORDER SUBMITTED (Telegram Bot NOT configured in .env):");
        console.log(`Order ID: ${orderId}`);
        console.log(`Product: ${productName} (Qty: ${quantity})`);
        console.log(`Total: ₹${totalPrice}`);
        console.log(`Customer: ${name} (Phone: ${phone})`);
        console.log(`Address: ${address}, Pin: ${pincode}`);
        console.log("----------------------------------------");
      }

      res.status(200).json({
        success: true,
        orderId,
        telegramConfigured: hasTelegramConfig,
        message: "Order placed successfully!"
      });

    } catch (error) {
      console.error("Error in confirm-order endpoint:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again."
      });
    }
  });

  // Dynamic route for products with injected SEO metadata & clean 404
  app.get("/products/:slug", async (req, res, next) => {
    const slug = req.params.slug;
    const product = PRODUCTS.find((p) => p.id === slug);

    if (!product) {
      res.status(404).send(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Product Not Found | Hovozon</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-50 flex flex-col items-center justify-center min-h-screen text-gray-800 font-sans p-6">
            <div class="max-w-md w-full bg-white border border-gray-150 p-8 rounded-3xl shadow-sm text-center">
              <span class="text-4xl">⚠️</span>
              <h1 class="text-2xl font-black text-gray-900 mt-4">Product Not Found</h1>
              <p class="text-gray-500 text-sm mt-2 leading-relaxed font-semibold">The product you are looking for does not exist or has been removed.</p>
              <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all mt-6 shadow-md shadow-blue-100">
                Go Back to Catalog
              </a>
            </div>
          </body>
        </html>
      `);
      return;
    }

    try {
      let templatePath = "";
      if (process.env.NODE_ENV !== "production") {
        templatePath = path.join(process.cwd(), "index.html");
      } else {
        templatePath = path.join(process.cwd(), "dist", "index.html");
      }

      const fs = await import("fs");
      let html = fs.readFileSync(templatePath, "utf-8");

      // Dynamically replace title and descriptions for premium social media sharing meta previews
      html = html.replace(/<title>.*?<\/title>/, `<title>${product.name} - Buy Cash on Delivery | Hovozon</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${product.tagline || product.description}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${product.name}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${product.tagline || product.description}" />`);

      // Inject OpenGraph Image if available to show rich link cards
      if (html.includes("</head>")) {
        const ogImageTags = `
    <meta property="og:image" content="${product.imageUrl}" />
    <meta name="twitter:image" content="${product.imageUrl}" />
        `;
        html = html.replace("</head>", `${ogImageTags}\n  </head>`);
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      console.error("Error serving dynamic product page:", err);
      next();
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Supply server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
