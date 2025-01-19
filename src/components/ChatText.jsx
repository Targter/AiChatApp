import React, { useState } from "react";
import { ReactTyped } from "react-typed";
import {
  useStore,
  useTypingStore,
  useProcessingStore,
  useTypingEffect,
} from "../store/useStore";
import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";

const ChatText = () => {
  const { chats, currentChat, user } = useStore();
  const { setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();
  const { initial } = useTypingEffect();
  const [type, setType] = useState(true);

  const currentChatData = chats.find((chat) => chat.id === currentChat);
  const messages = currentChatData?.messages || [];

  const displayedMessages = user.isPremium ? messages : messages.slice(-10);
  const lastMessage = displayedMessages.length - 1;
  console.log("text box calling", displayedMessages);
  return (
    <>
      {!user.isPremium && messages.length > 10 && (
        <div className="text-center py-2 bg-[#424242] text-indigo-50 rounded-lg">
          Upgrade to premium to see your full chat history
        </div>
      )}
      {messages.length === 0 && (
        <div className="w-full h-full flex flex-col gap-3 justify-center items-center text-3xl">
          <img src="robot-svgrepo-com.svg" alt="" className="w-44 h-44 mb-4 " />
          How can i help you
        </div>
      )}

      {displayedMessages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          } p-3`}
        >
          {message.role !== "user" && (
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <div
            className={`max-w-[70%] rounded-lg md:p-3 p-2 ${
              message.role === "user"
                ? "text-[#ECECEC] bg-[#2f2f2f]"
                : "text-[#ECECEC]"
            }`}
            key={message.id}
          >
            {message.role === "assistant" &&
            index === lastMessage &&
            initial ? (
              <ReactTyped
                strings={[message.content]}
                typeSpeed={12}
                showCursor={false}
                onComplete={() => {
                  console.log("Typing completed for message:", message.id);
                  setIsProcessing(currentChat, false);
                  setTypingComplete(currentChat, true);
                  const { setTypingState } = useTypingEffect.getState();
                  setTypingState(); // Set initial to false when typing is complete
                }}
              />
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
            {message.image && !message.loading && (
              <div className="max-w-[70%] rounded-lg ">
                <img
                  src={message.image}
                  alt="Related content"
                  className="max-w-xs max-h-40 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatText;
