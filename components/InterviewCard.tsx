import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeConfig = {
    Behavioral: {
      color: "from-emerald-500 to-green-600",
      icon: "🧠",
      text: "bg-emerald-500/20 text-emerald-300",
    },
    Mixed: {
      color: "from-amber-500 to-orange-600",
      icon: "🔄",
      text: "bg-amber-500/20 text-amber-300",
    },
    Technical: {
      color: "from-blue-500 to-cyan-600",
      icon: "⚡",
      text: "bg-blue-500/20 text-blue-300",
    },
  }[normalizedType] || {
    color: "from-gray-500 to-gray-600",
    icon: "📝",
    text: "bg-gray-500/20 text-gray-300",
  };

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const score = feedback?.totalScore || 0;
  const scoreColor =
    score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="card-border w-[380px] max-sm:w-full min-h-[420px] group hover:scale-105 transition-all duration-300">
      <div className="card-interview">
        <div className="space-y-6">
          {/* Type Badge */}
          <div className="absolute top-0 right-0 overflow-hidden">
            <div
              className={`px-6 py-3 bg-gradient-to-r ${badgeConfig.color} text-white font-semibold text-sm rounded-bl-2xl shadow-lg flex items-center gap-2`}
            >
              <span>{badgeConfig.icon}</span>
              <span>{normalizedType}</span>
            </div>
          </div>

          {/* Cover Image with Gradient Ring */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-60 scale-110"></div>
            <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-full w-fit">
              <Image
                src={getRandomInterviewCover()}
                alt="interview-cover"
                width={100}
                height={100}
                className="rounded-full object-cover size-[100px] bg-slate-800"
              />
            </div>
          </div>

          {/* Interview Role */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white capitalize bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {role} Interview
            </h3>

            {/* Date & Score */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-sm font-medium">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-2 rounded-full">
                <span className="text-lg">⭐</span>
                <span className={`font-bold text-sm ${scoreColor}`}>
                  {feedback?.totalScore || "---"}/100
                </span>
              </div>
            </div>

            {/* Progress Bar for Score */}
            {feedback?.totalScore && (
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    score >= 80
                      ? "from-emerald-400 to-green-500"
                      : score >= 60
                      ? "from-amber-400 to-orange-500"
                      : "from-red-400 to-pink-500"
                  } 
                    transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                ></div>
              </div>
            )}

            {/* Feedback or Placeholder Text */}
            <div className="bg-slate-800/30 rounded-2xl p-4 border border-purple-500/10">
              <p className="text-slate-300 line-clamp-3 leading-relaxed">
                {feedback?.finalAssessment ||
                  "🚀 Ready to showcase your skills? Take this interview to receive personalized AI feedback and improve your performance!"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center pt-4 border-t border-purple-500/20">
          <DisplayTechIcons techStack={techstack} />

          <Button
            className={`${
              feedback ? "btn-secondary" : "btn-primary"
            } text-sm px-6 py-3 font-semibold`}
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              className="flex items-center gap-2"
            >
              {feedback ? (
                <>
                  <span>📊</span>
                  <span>View Feedback</span>
                </>
              ) : (
                <>
                  <span>🎯</span>
                  <span>Start Interview</span>
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
