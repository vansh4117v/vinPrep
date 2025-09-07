"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateFeedbackPDF } from "@/lib/pdf-generator";
import { Download, Loader2 } from "lucide-react";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";

interface DashboardPDFDownloadProps {
  interviewId: string;
  userId: string;
  userName: string;
  userEmail: string;
  interviewRole: string;
  className?: string;
}

const DashboardPDFDownload = ({
  interviewId,
  userId,
  userName,
  userEmail,
  interviewRole,
  className,
}: DashboardPDFDownloadProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      // Fetch the feedback and interview data
      const [feedback, interview] = await Promise.all([
        getFeedbackByInterviewId({ interviewId, userId }),
        getInterviewById(interviewId),
      ]);

      if (!feedback || !interview) {
        alert("Feedback report not available for this interview.");
        return;
      }

      const user = {
        id: userId,
        name: userName,
        email: userEmail,
      };

      const feedbackWithUserId = {
        ...feedback,
        userId,
      };

      generateFeedbackPDF(feedbackWithUserId, interview, user);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      variant="ghost"
      size="sm"
      className={`text-purple-300 hover:text-white hover:bg-purple-500/20 ${className}`}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
};

export default DashboardPDFDownload;
