import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./openai";
import { insertMessageSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      if (message.role === "user") {
        const aiResponse = await getChatResponse(message.content);
        const assistantMessage = await storage.createMessage({
          content: aiResponse,
          role: "assistant",
          metadata: { model: "gpt-4o" }
        });
        
        res.json({ userMessage: message, assistantMessage });
      } else {
        res.json({ message });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
