
import { useQuery } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import { ChatMessage } from "./chat-message";

interface ThreadMessagesProps {
  parentId: number;
}

export function ThreadMessages({ parentId }: ThreadMessagesProps) {
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages", parentId, "replies"],
  });

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}
