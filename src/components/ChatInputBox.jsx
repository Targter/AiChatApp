import React, { useCallback, memo, useState, useEffect, useRef } from "react";

import { Send } from "lucide-react";
import {
  useProcessingStore,
  useSidebarStore,
  useTypingStore,
  useStore,
  useUserStore,
} from "../store/useStore";

const ChatInputBox = memo(() => {
  const [input, setInput] = useState("");
  const { addChat } = useSidebarStore();
  const { currentChat, addMessage } = useStore();
  const { getIsProcessing, setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();
  //
  const [showSubscriptionWarning, setShowSubscriptionWarning] = useState(false);
  const { subscriptionEndDate } = useUserStore();

  const isProcessing = currentChat ? getIsProcessing(currentChat) : false;

  //

  const parsedSubscriptionDate = new Date(subscriptionEndDate);
  const isSubscriptionExpired =
    !isNaN(parsedSubscriptionDate) && parsedSubscriptionDate < new Date();

  console.log("date:", subscriptionEndDate);
  console.log("isSubscriptionExpired:", isSubscriptionExpired);

  const inputRef = useRef(); // Create a ref for the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChat]);
  const handleSubscriptionExpiration = useCallback(() => {
    setShowSubscriptionWarning(true);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (e) => {
      e?.preventDefault();

      setIsProcessing(currentChat, true);
      setTypingComplete(currentChat, false);
      // Check if subscription is expired
      if (isSubscriptionExpired) {
        handleSubscriptionExpiration();
        return;
      }
      if (!input.trim() || isProcessing) {
        return;
      }

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

        setIsProcessing(currentChat, false);
        //
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [
      currentChat,
      input,
      addMessage,
      addChat,
      setIsProcessing,
      setTypingComplete,
      isSubscriptionExpired,
    ]
  );

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  console.log("only input box rendering");

  return (
    <div className="w-full">
      {/* Subscription Warning Modal */}
      {showSubscriptionWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Subscription Expired</h3>
            <p className="text-sm text-gray-600">
              Your subscription has expired. Please renew to continue using the
              service.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSubscriptionWarning(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Redirect to the subscription renewal page
                  window.location.href = "/subscription";
                }}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Renew Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
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
            isProcessing
              ? "Please wait, processing..."
              : // : isSubscriptionExpired
                // ? "Your subscription has expired. Please renew to continue."
                "Type your message..."
          }
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-[#2f2f2f] w-[90%]"
          disabled={isProcessing} // Disable input if processing or subscription expired
          ref={inputRef} // Attach the ref to the input field
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isProcessing} // Disable button if input is empty, processing, or subscription expired
          className="bg-white text-black p-2 rounded-lg disabled:opacity-50 text-center"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
});

export default ChatInputBox;
