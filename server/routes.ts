import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./openai";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import { adminAuth } from "./firebase-admin";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Middleware to verify Firebase token
  const verifyAuth = async (req: any, res: any, next: any) => {
    try {
      const token = req.headers.authorization?.split("Bearer ")[1];
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decodedToken = await adminAuth.verifyIdToken(token);
      if (!decodedToken.email_verified) {
        return res.status(403).json({ error: "Email not verified" });
      }

      req.user = decodedToken;
      next();
    } catch (error: any) {
      console.error("Auth error:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Create a new conversation
  app.post("/api/conversations", verifyAuth, async (req: any, res) => {
    try {
      const conversationData = insertConversationSchema.parse({
        ...req.body,
        userId: req.user.uid
      });
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all conversations for a user
  app.get("/api/conversations", verifyAuth, async (req: any, res) => {
    try {
      const conversations = await storage.getConversations(req.user.uid);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single conversation
  app.get("/api/conversations/:id", verifyAuth, async (req: any, res) => {
    try {
      const conversation = await storage.getConversation(parseInt(req.params.id));
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      if (conversation.userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const messages = await storage.getMessages(conversation.id);
      res.json({ conversation, messages });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message in a conversation
  app.post("/api/conversations/:id/messages", verifyAuth, async (req: any, res) => {
    try {
      const conversation = await storage.getConversation(parseInt(req.params.id));
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      if (conversation.userId !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const messageData = insertMessageSchema.parse({
        ...req.body,
        conversationId: conversation.id
      });

      const message = await storage.createMessage(messageData);

      if (message.role === "user") {
        const aiResponse = await getChatResponse(message.content);
        const assistantMessage = await storage.createMessage({
          content: aiResponse,
          role: "assistant",
          conversationId: conversation.id,
          metadata: { model: "gpt-4o" }
        });

        res.json({ userMessage: message, assistantMessage });
      } else {
        res.json({ message });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}