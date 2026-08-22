import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

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
