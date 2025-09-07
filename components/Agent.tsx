"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { enhancedInterviewer } from "@/constants/enhanced-interviewer";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      // Check if workflow ID is available
      const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

      if (workflowId && workflowId.trim() !== "") {
        await vapi.start(workflowId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        // Fallback to enhanced interviewer assistant if no workflow ID
        console.log(
          "No workflow ID found, using enhanced interviewer assistant as fallback"
        );
        await vapi.start(enhancedInterviewer, {
          variableValues: {
            username: userName,
            questions:
              "Please conduct a comprehensive interview following the structured conversational flow. Start by asking about the role type, then customize the interview based on their responses.",
          },
        });
      }
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(enhancedInterviewer, {
        variableValues: {
          username: userName,
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-slate-800 via-purple-900/30 to-slate-900 p-6 rounded-3xl border border-purple-500/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              {/* AI Avatar with Glow Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-full">
                  <div className="bg-slate-900 rounded-full p-4 relative">
                    <Image
                      src="/ai-avatar.png"
                      alt="VinPrep AI Interviewer"
                      width={60}
                      height={54}
                      className="object-cover relative z-10"
                    />
                    {isSpeaking && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  VinPrep AI
                </h3>
                <p className="text-purple-200/80 text-sm">
                  Your Personal Interview Coach
                </p>
                <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSpeaking ? "bg-green-400 animate-pulse" : "bg-slate-400"
                    }`}
                  ></div>
                  <span>{isSpeaking ? "Speaking..." : "Ready"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-slate-800 via-cyan-900/30 to-slate-900 p-6 rounded-3xl border border-cyan-500/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              {/* User Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-500 p-1 rounded-full">
                  <Image
                    src="/profile.svg"
                    alt="Your Profile"
                    width={90}
                    height={90}
                    className="rounded-full object-cover bg-slate-900"
                  />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">{userName}</h3>
                <p className="text-cyan-200/80 text-sm">Interview Candidate</p>
                <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Transcript */}
      {messages.length > 0 && (
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">
                Live Transcript
              </span>
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-4 min-h-[80px] flex items-center justify-center">
              <p
                key={lastMessage}
                className={cn(
                  "text-lg text-center text-white transition-all duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {lastMessage || "Conversation will appear here..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative group"
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3 rounded-3xl font-bold text-white text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-xl">
              {callStatus === "CONNECTING" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">📞</span>
                  <span>
                    {callStatus === "FINISHED"
                      ? "Start New Interview"
                      : "Start Interview"}
                  </span>
                </>
              )}
            </div>
          </button>
        ) : (
          <button className="relative group" onClick={() => handleDisconnect()}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-pink-600 px-10 py-3 rounded-3xl font-bold text-white text-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-xl">
              <span className="text-2xl">⏹️</span>
              <span>End Interview</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
