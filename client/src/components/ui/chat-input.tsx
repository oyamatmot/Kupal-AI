import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Kupal-AI..."
        disabled={disabled}
        className="flex-1 bg-black/50 border-purple-500/30 focus:border-purple-500 placeholder:text-purple-300/50"
      />
      <Button 
        type="submit" 
        disabled={disabled || !message.trim()}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}