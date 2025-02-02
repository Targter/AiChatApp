import React, { useState, useEffect } from "react";
import { ReactTyped } from "react-typed";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TypingMarkdown = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  const { setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (isTypingComplete) {
      // Handle any additional logic after typing is complete
    }
  }, [isTypingComplete]);

  //   const handleTypingComplete = () => {
  //     setIsTypingComplete(true);
  //   };

  return (
    <div>
      <ReactTyped
        strings={[text]}
        // strings={[message.content]}
        typeSpeed={12}
        onComplete={() => {
          console.log("Typing completed for message:", message.id);
          setIsProcessing(currentChat, false);
          setTypingComplete(currentChat, true);
          const { setTypingState } = useTypingEffect.getState();
          setTypingState(); // Set initial to false when typing is complete
        }}
        onStringTyped={(arrayPos) => {
          setDisplayedText(text);
        }}
      />
      {isTypingComplete && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {displayedText}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default TypingMarkdown;
