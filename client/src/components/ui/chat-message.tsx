import { type Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Card } from "./card";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8">
        <div className={cn(
          "h-full w-full rounded-full",
          isUser ? "bg-blue-500" : "bg-purple-500"
        )}>
          {isUser ? "U" : "A"}
        </div>
      </Avatar>
      <Card className={cn(
        "max-w-[80%] p-3",
        isUser ? "bg-blue-500 text-white" : "bg-background"
      )}>
        <p className="text-sm">{message.content}</p>
      </Card>
    </div>
  );
}
