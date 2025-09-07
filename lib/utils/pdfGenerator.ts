import jsPDF from "jspdf";

interface FeedbackData {
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
}

interface InterviewData {
  id: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
}

export const generateFeedbackPDF = (
  feedback: FeedbackData,
  interview: InterviewData,
  user: UserData
) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const margin = 20;
  const lineHeight = 7;

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 11
  ) => {
    pdf.setFontSize(fontSize);
    const splitText = pdf.splitTextToSize(text, maxWidth);
    pdf.text(splitText, x, y);
    return y + splitText.length * lineHeight;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(111, 66, 193); // Purple color
  pdf.text("VinPrep Interview Feedback Report", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Add decorative line
  pdf.setLineWidth(1);
  pdf.setDrawColor(111, 66, 193);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Candidate Information
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Candidate Information", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Name: ${user.name}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`Email: ${user.email}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(
    `Interview Date: ${new Date(feedback.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`,
    margin,
    yPosition
  );
  yPosition += 15;

  // Interview Details
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Interview Details", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Position: ${interview.role}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`Level: ${interview.level}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(`Type: ${interview.type}`, margin, yPosition);
  yPosition += lineHeight;
  pdf.text(
    `Technology Stack: ${interview.techstack.join(", ")}`,
    margin,
    yPosition
  );
  yPosition += 15;

  // Overall Score - Highlighted Box
  checkNewPage(30);
  pdf.setFillColor(111, 66, 193);
  pdf.setTextColor(255, 255, 255);
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 20, "F");
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Overall Score: ${feedback.totalScore}/100`,
    pageWidth / 2,
    yPosition + 7,
    { align: "center" }
  );
  yPosition += 25;

  // Category Scores
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Detailed Assessment", margin, yPosition);
  yPosition += 10;

  feedback.categoryScores.forEach((category, index) => {
    checkNewPage(25);

    // Category header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 12, "F");
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `${index + 1}. ${category.name}: ${category.score}/100`,
      margin + 5,
      yPosition + 5
    );
    yPosition += 15;

    // Category comment
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    yPosition = addWrappedText(
      category.comment,
      margin + 10,
      yPosition,
      pageWidth - 2 * margin - 10,
      10
    );
    yPosition += 10;
  });

  // Strengths
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 197, 94); // Green color
  pdf.text("Strengths", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  feedback.strengths.forEach((strength, index) => {
    checkNewPage(15);
    pdf.text("•", margin, yPosition);
    yPosition = addWrappedText(
      strength,
      margin + 10,
      yPosition,
      pageWidth - 2 * margin - 10
    );
    yPosition += 5;
  });
  yPosition += 10;

  // Areas for Improvement
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(239, 68, 68); // Red color
  pdf.text("Areas for Improvement", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  feedback.areasForImprovement.forEach((area, index) => {
    checkNewPage(15);
    pdf.text("•", margin, yPosition);
    yPosition = addWrappedText(
      area,
      margin + 10,
      yPosition,
      pageWidth - 2 * margin - 10
    );
    yPosition += 5;
  });
  yPosition += 10;

  // Final Assessment
  checkNewPage(60);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(111, 66, 193);
  pdf.text("Final Assessment", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  yPosition = addWrappedText(
    feedback.finalAssessment,
    margin,
    yPosition,
    pageWidth - 2 * margin
  );
  yPosition += 20;

  // Footer
  checkNewPage(30);
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(111, 66, 193);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    "Generated by VinPrep AI Interview Platform",
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  pdf.text(`Report ID: ${feedback.id}`, pageWidth / 2, yPosition + 7, {
    align: "center",
  });

  // Save the PDF
  const fileName = `VinPrep_Feedback_${interview.role}_${
    new Date(feedback.createdAt).toISOString().split("T")[0]
  }.pdf`;
  pdf.save(fileName);
};
