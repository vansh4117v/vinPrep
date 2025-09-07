"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateFeedbackPDF } from "@/lib/pdf-generator";
import { Download, Loader2 } from "lucide-react";

interface PDFDownloadButtonProps {
  feedback: {
    id: string;
    interviewId: string;
    totalScore: number;
    categoryScores: Array<{
      name: string;
      score: number;
      comment: string;
    }>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
    createdAt: string;
    userId: string;
  };
  interview: {
    id: string;
    role: string;
    level: string;
    type: string;
    questions: string[];
    techstack: string[];
    createdAt: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const PDFDownloadButton = ({
  feedback,
  interview,
  user,
}: PDFDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));

      generateFeedbackPDF(feedback, interview, user);
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
      className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download Feedback Report</span>
        </>
      )}
    </Button>
  );
};

export default PDFDownloadButton;
