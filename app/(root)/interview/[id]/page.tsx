import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="absolute inset-0 top-[80px] flex flex-col px-4 pt-12">
      {/* Compact Interview Header */}
      <div className="flex flex-row gap-4 justify-between items-center bg-slate-800/30 rounded-2xl p-4 backdrop-blur-sm border border-purple-500/20 mb-8">
        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-row gap-3 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={32}
              height={32}
              className="rounded-full object-cover size-[32px]"
            />
            <h3 className="text-lg font-semibold text-white capitalize">
              {interview.role} Interview
            </h3>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
          <span className="text-sm font-medium text-purple-200">
            {interview.type}
          </span>
        </div>
      </div>

      {/* Interview Agent positioned slightly below navbar */}
      <div className="flex-1">
        <div className="w-full max-w-6xl mx-auto">
          <Agent
            userName={user?.name!}
            userId={user?.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
