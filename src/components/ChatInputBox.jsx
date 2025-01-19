import React, { useCallback, memo, useState } from "react";

import { Send } from "lucide-react";
import {
  useProcessingStore,
  useSidebarStore,
  useTypingStore,
  useStore,
} from "../store/useStore";

const ChatInputBox = memo(() => {
  const [input, setInput] = useState("");
  const { addChat } = useSidebarStore();
  const { currentChat, addMessage } = useStore();
  const { getIsProcessing, setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();

  const isProcessing = currentChat ? getIsProcessing(currentChat) : false;

  const handleSendMessage = useCallback(async () => {
    setIsProcessing(currentChat, true);
    setTypingComplete(currentChat, false);

    if (input.trim()) {
      const message = {
        role: "user",
        content: input,
      };
      setInput("");

      if (!currentChat) {
        const newChatId = await addChat();
        await addMessage(newChatId, message);
      } else {
        await addMessage(currentChat, message);
      }
    }
  }, [
    currentChat,
    input,
    addMessage,
    addChat,
    setIsProcessing,
    setTypingComplete,
  ]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  console.log("only input box rendering");

  return (
    <div>
      <form
        action="submit"
        onSubmit={handleSendMessage}
        className="flex space-x-2 w-full"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={
            isProcessing ? "Please wait, processing..." : "Type your message..."
          }
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-[#2f2f2f] w-[90%]"
          disabled={isProcessing}
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className="bg-white text-black p-2 rounded-lg disabled:opacity-50 text-center "
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
});

export default ChatInputBox;
