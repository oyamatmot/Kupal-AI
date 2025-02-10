import { type Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Card } from "./card";

interface ChatMessageProps {
  message: Message;
}

type Reaction = '👍' | '❤️' | '😄' | '🤔' | '👏';

export function ChatMessage({ message }: ChatMessageProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const availableReactions: Reaction[] = ['👍', '❤️', '😄', '🤔', '👏'];
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
      <div className="flex flex-col gap-2">
        <Card className={cn(
          "max-w-[80%] p-3",
          isUser ? "bg-blue-500 text-white" : "bg-background"
        )}>
          {message.content.includes('```') ? (
            message.content.split('```').map((part, index) => {
              if (index % 2 === 1) {
                const [language, ...code] = part.split('\n');
                return (
                  <CodeBlock
                    key={index}
                    code={code.join('\n')}
                    language={language || 'javascript'}
                  />
                );
              }
              return <p key={index} className="text-sm">{part}</p>;
            })
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </Card>
        <div className="flex gap-1">
          {availableReactions.map((reaction) => (
            <button
              key={reaction}
              onClick={() => setReactions([...reactions, reaction])}
              className="hover:scale-125 transition-transform"
            >
              {reaction}
            </button>
          ))}
          {reactions.length > 0 && (
            <div className="flex gap-1 ml-2">
              {reactions.map((reaction, index) => (
                <span key={index}>{reaction}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
