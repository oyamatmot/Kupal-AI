
import { useState } from 'react';
import { Button } from './button';
import { Avatar } from "./avatar";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Star, Heart, MessageSquare, ArrowRight, Square } from 'lucide-react';
import { type Message } from "@shared/schema";
import { CodeBlock } from './code-block';

interface ChatMessageProps {
  message: Message;
  onReply?: (parentId: number) => void;
}

export function ChatMessage({ message, onReply }: ChatMessageProps) {
  const [showThread, setShowThread] = useState(false);
  const [reactions, setReactions] = useState<{[key: string]: number}>({
    like: 0,
    dislike: 0,
    star: 0,
    heart: 0
  });
  const isUser = message.role === "user";

  const handleReaction = (type: string) => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

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
      <div className="flex flex-col gap-2 max-w-[80%]">
        <Card className={cn(
          "p-3",
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
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleReaction('like')}>
            <ThumbsUp className="h-4 w-4 mr-1" />
            {reactions.like}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleReaction('dislike')}>
            <ThumbsDown className="h-4 w-4 mr-1" />
            {reactions.dislike}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleReaction('star')}>
            <Star className="h-4 w-4 mr-1" />
            {reactions.star}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleReaction('heart')}>
            <Heart className="h-4 w-4 mr-1" />
            {reactions.heart}
          </Button>
          {onReply && (
            <Button variant="ghost" size="sm" onClick={() => onReply(message.id)}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
          {message.threadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowThread(!showThread)}>
              <ArrowRight className={`h-4 w-4 mr-1 transform ${showThread ? 'rotate-90' : ''}`} />
              {message.threadCount} replies
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
