import { useQuery, useMutation } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatSearch } from "@/components/ui/chat-search";
import { TopBar } from "@/components/ui/top-bar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
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

  const [showSearch, setShowSearch] = useState(false);

  const handleMessageSelect = (messageId: number) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setShowSearch(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => exportAsMarkdown(messages || [])}
          >
            Export MD
          </Button>
          <Button
            variant="ghost"
            onClick={() => exportAsPDF(messages || [])}
          >
            Export PDF
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowPreferences(true)}
          >
            Preferences
          </Button>
        </div>
      </TopBar>
      <PreferencesDialog
        open={showPreferences}
        onOpenChange={setShowPreferences}
        preferences={preferences}
        setPreferences={setPreferences}
      />
      {showSearch && (
        <div className="p-4">
          <ChatSearch messages={messages || []} onSelect={handleMessageSelect} />
        </div>
      )}
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
