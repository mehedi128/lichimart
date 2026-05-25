import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Telegram Send Message Proxy Endpoint
  app.post("/api/telegram/send", async (req, res) => {
    const { botToken, chatId, message } = req.body;
    if (!botToken || !chatId || !message) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return res.json({ success: true, data });
      } else {
        const errorText = await response.text();
        return res.status(response.status).json({ success: false, error: errorText });
      }
    } catch (err: any) {
      console.error("Error in server telegram proxy:", err);
      return res.status(500).json({ success: false, error: err.message || "Failed to proxy" });
    }
  });

  // Telegram Get Chat ID Proxy Endpoint
  app.post("/api/telegram/getChatId", async (req, res) => {
    const { botToken } = req.body;
    if (!botToken) {
      return res.status(400).json({ success: false, error: "Bot token is required" });
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates`;
      const response = await fetch(url);
      if (!response.ok) {
        return res.status(response.status).json({ success: false, error: `Telegram status ${response.status}` });
      }
      const data = await response.json();
      if (data.ok && data.result && data.result.length > 0) {
        for (let i = data.result.length - 1; i >= 0; i--) {
          const update = data.result[i];
          if (update.message && update.message.chat) {
            return res.json({ success: true, chatId: update.message.chat.id.toString() });
          }
        }
      }
      return res.json({ success: false, error: "No message found in updates. Please send /start to your bot first." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || "Failed to get updates" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
