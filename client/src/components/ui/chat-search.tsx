
import React from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './command';
import { type Message } from '@shared/schema';
import { Search } from 'lucide-react';

interface ChatSearchProps {
  messages: Message[];
  onSelect: (messageId: number) => void;
}

export function ChatSearch({ messages, onSelect }: ChatSearchProps) {
  return (
    <Command className="rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput placeholder="Search messages..." />
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Messages">
          {messages.map((message) => (
            <CommandItem
              key={message.id}
              onSelect={() => onSelect(message.id)}
            >
              <span className="truncate">{message.content}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
