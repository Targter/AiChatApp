import React, { useEffect, useState } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useChat } from "../hooks/useChat";
function VoiceRecognition({ isListening, inputdata }) {
  // const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State to control audio playback

  const { fetchAudio } = useChat();
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  let silenceTimer = null;
  if (!browserSupportsSpeechRecognition) {
    console.log("Speech recognition not supported");
    return null;
  }
  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
      // console.log("listening.script...");
    } else {
      SpeechRecognition.stopListening();
      finalizeSegment();
    }
  }, [isListening]);
  const finalizeSegment = () => {
    if (transcript) {
      resetTranscript();
      console.log("transcript.script...");
      fetchAudio(transcript);
    }
  };

  // useEffect(() => {
  //   if (transcript) {
  //     if (silenceTimer) clearTimeout(silenceTimer);
  //     silenceTimer = setTimeout(() => {
  //       finalizeSegment(); // Finalize the segment after 1 sec of silence
  //     }, 1000);
  //   }
  //   return () => clearTimeout(silenceTimer);
  // }, [transcript]);

  return (
    <div>
      <p className="text-center max-w-[350px] mb-3  rounded-md mr-[460px] max-h-[40px] bg-black text-white ">
        {transcript}
      </p>
    </div>
  );
}

export default VoiceRecognition;
