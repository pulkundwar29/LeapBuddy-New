import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!messages || messages.length === 0) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            background: message.role === "user" 
              ? "linear-gradient(to right, #e5e7eb, #d1d5db)"
              : "linear-gradient(to right, #93c5fd, #818cf8, #fca5a5)"
          }}
          className={cn(
            "p-2 rounded-lg text-sm max-w-[80%] transition-all duration-200",
            message.role === "user"
              ? "text-gray-900 ml-auto shadow-lg hover:shadow-xl"
              : "text-gray-900 mr-auto shadow-lg hover:shadow-xl"
          )}
        >
          <p className="text-sm font-medium">
            {message.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;