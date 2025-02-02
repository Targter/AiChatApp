import React, { useState, useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { User } from "lucide-react";
import {
  useStore,
  useTypingStore,
  useProcessingStore,
  useTypingEffect,
  useUIStore,
} from "../store/useStore";
import ChatInput from "./ChatInput";

const ChatText = () => {
  const { chats, currentChat, user } = useStore();
  const { setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();
  const { initial } = useTypingEffect();
  const chatEndRef = useRef(null); // For auto-scroll
  const { chatStarted, setChatStarted } = useUIStore();
  const currentChatData = chats.find((chat) => chat.id === currentChat);
  const messages = currentChatData?.messages || [];

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update chat state when a message is sent
  useEffect(() => {
    if (messages.length > 0 && !chatStarted) {
      setChatStarted(true);
    }
  }, [messages.length, chatStarted, setChatStarted]);

  const displayedMessages = user.isPremium ? messages : messages.slice(-10);
  const lastMessageIndex = displayedMessages.length - 1;

  return (
    <>
      {!user.isPremium && messages.length > 10 && (
        <div className="text-center py-2 bg-[#424242] text-indigo-50 rounded-lg">
          Upgrade to premium to see your full chat history
        </div>
      )}

      {!chatStarted && (
        <div className="h-auto flex flex-col gap-3 justify-center items-center text-2xl mt-[200px]">
          How can I help you?
        </div>
      )}

      <div className={`${chatStarted && "h-full"} p-5 w-[80%] overflow-y-auto`}>
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
              className={`max-w-[100%] rounded-lg md:p-3 p-2 ${
                message.role === "user"
                  ? "text-[#ECECEC] bg-[#2f2f2f]"
                  : "text-[#ECECEC]   w-[80%]"
              } text-xl leading-7 tracking-normal`}
            >
              {message.role === "assistant" &&
              index === lastMessageIndex &&
              initial ? (
                // <ReactTyped
                //   strings={[message.content]}
                //   typeSpeed={12}
                //   showCursor={false}
                //   onComplete={() => {
                //     console.log("Typing completed for message:", message.id);
                //     setIsProcessing(currentChat, false);
                //     setTypingComplete(currentChat, true);
                //     const { setTypingState } = useTypingEffect.getState();
                //     setTypingState(); // Set initial to false when typing is complete
                //   }}
                // />
                <ReactMarkdown
                remarkPlugins={[remarkGfm]} // Support for GitHub Flavored Markdown
                rehypePlugins={[rehypeRaw]} // Allow raw HTML rendering within Markdown
                className="prose prose-invert"
              >
                {message.content}
              </ReactMarkdown>
              ) : (
                <>
                  {/* Render Markdown content with the assistant's message */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Support for GitHub Flavored Markdown
                    rehypePlugins={[rehypeRaw]} // Allow raw HTML rendering within Markdown
                    className="prose prose-invert"
                  >
                    {message.content}
                  </ReactMarkdown>
                </>
              )}
              {message.image && !message.loading && (
                <div className="max-w-[70%] rounded-lg">
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
        <div ref={chatEndRef} />
      </div>
    </>
  );
};

export default ChatText;
