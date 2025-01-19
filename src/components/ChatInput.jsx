import React from "react";
import { useCallback, useEffect, useState, memo } from "react";
import { Mic } from "lucide-react";
import { useStore, useProcessingStore } from "../store/useStore";
import "regenerator-runtime/runtime";
// import {ReactTyped}  from "react-typed";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ChatInputBox from "./ChatInputBox";

const InputBox = memo(ChatInputBox);

const ChatInput = memo(() => {
  console.log("chat input calling");
  const { currentChat, addMessage } = useStore();
  const { getIsProcessing, setIsProcessing } = useProcessingStore();
  //   const { typingComplete } = useTypingStore();
  const [isRecording, setIsRecording] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  const isProcessing = currentChat ? getIsProcessing(currentChat) : false;

  useEffect(() => {
    console.log("starting useEffect calling");
    // Reset transcript when switching to a new chat
    if (currentChat) {
      resetTranscript();
    }
  }, [currentChat, resetTranscript]);

  const toggleRecording = useCallback(() => {
    console.log("toggle Recording calling");
    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setIsRecording(true);
    }
  }, [isRecording]);

  const processAudio = useCallback(async () => {
    console.log("processAudio calling");
    if (!transcript || !currentChat) return;

    setIsProcessing(currentChat, true); // Set isProcessing to true for current chat
    //   setTypingComplete(currentChat, false); // Set typingComplete to false for current chat

    try {
      // Add transcribed text as a user message
      await addMessage(currentChat, {
        content: transcript,
        role: "user",
      });

      resetTranscript();
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      //   setIsProcessing(false);
      setIsProcessing(currentChat, false); // Set isProcessing to true for current chat
      //   setTypingComplete(currentChat, false); // Set typingComplete to false for current chat
    }
  }, [transcript, currentChat, addMessage, resetTranscript]);

  return (
    <div className="p-4  ">
      <div className="flex space-x-2">
        <button
          onClick={toggleRecording}
          className={`p-2 rounded-full ${
            isRecording
              ? "bg-[#2f2f2f] text-red-600"
              : "bg-[#2f2f2f] text-gray-600"
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
        {transcript && (
          <button
            onClick={processAudio}
            disabled={isProcessing}
            className="bg-green-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Send Audio"}
          </button>
        )}
        <div className="w-full">
          {/* <ChatInputBox /> */}
          <InputBox />
        </div>
      </div>
    </div>
  );
});

export default ChatInput;
