import type { Message, InsertMessage } from "@shared/schema";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private messages: Message[];
  private currentId: number;

  constructor() {
    this.messages = [];
    this.currentId = 1;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentId++,
      content: insertMessage.content,
      role: insertMessage.role,
      timestamp: new Date(),
      metadata: insertMessage.metadata
    };
    this.messages.push(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }
}

export const storage = new MemStorage();
