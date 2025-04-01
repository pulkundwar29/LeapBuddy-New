"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { Select } from "./ui/select"; // Import Select component

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState("gemini"); // State to manage selected model
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
      model: selectedModel, // Pass the selected model to the backend
    },
    initialMessages: data || [],
  });

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messageContainerRef.current) {
        const scrollElement = messageContainerRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    if (data && data.length > 0) {
      scrollToBottom();
    }
  }, [data]);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit z-10">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* Model Selection */}
      <div className="p-2 bg-blue-200">
        <Select
          id="model"
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full"
        >
          <option value="gemini">Gemma-2-9b (General Purpose)</option>
          <option value="custom-small">Qwen - Qwen2.5-1.5B-Instruct (For AI-ML purposes)</option>
          <option value="custom-big">Google - Gemma-2-2b-it (For Embedded Systems)</option>
          <option value="custom-big">Meta - Llama-3.2-1b-it (For PCB Design)</option>
        </Select>
      </div>

      {/* Message List */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-2 min-h-0"
      >
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
