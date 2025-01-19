
import ChatText from "./ChatText";
import ChatInput from "./ChatInput"
import { memo } from "react";

const ChatTextBox = memo(ChatText)
const ChatInputBox = memo(ChatInput)
export function ChatWindow() {


console.log("chatwindow")
  
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-h-screen">
      <div className="flex-1 overflow-y-auto  md:p-4 p-0 space-y-4   ">
      {/* <ChatText /> */}
      <ChatTextBox/>
      </div>
      {/* <ChatInput /> */}
      <ChatInputBox />
    </div>

  );
}
