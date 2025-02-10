import { useQuery, useMutation } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { TopBar } from "@/components/ui/top-bar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const { toast } = useToast();
  
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"]
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        content,
        role: "user"
      });
      return res.json();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message"
      });
    }
  });

  const handleSend = (content: string) => {
    mutation.mutate(content);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          messages?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <div className="p-4 border-t">
        <ChatInput 
          onSend={handleSend}
          disabled={mutation.isPending}
        />
      </div>
    </div>
  );
}
