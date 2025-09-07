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
  userId: string;
}

interface InterviewData {
  id: string;
  role: string;
  level: string;
  type: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export async function generateFeedbackPDF(
  feedback: FeedbackData,
  interview: InterviewData,
  user: UserData
): Promise<void> {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Header
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("VinPrep Interview Feedback Report", margin, yPosition);

    yPosition += 20;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      margin,
      yPosition
    );

    yPosition += 30;

    // Candidate Information
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Candidate Information", margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${user.name}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Email: ${user.email}`, margin, yPosition);
    yPosition += 10;
    pdf.text(
      `Interview Date: ${new Date(interview.createdAt).toLocaleDateString()}`,
      margin,
      yPosition
    );

    yPosition += 25;

    // Interview Details
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Interview Details", margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Position: ${interview.role}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Level: ${interview.level}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Type: ${interview.type}`, margin, yPosition);
    yPosition += 10;
    pdf.text(
      `Tech Stack: ${interview.techstack.join(", ")}`,
      margin,
      yPosition
    );

    yPosition += 25;

    // Overall Score
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Overall Performance", margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");

    // Color based on score
    if (feedback.totalScore >= 80) {
      pdf.setTextColor(34, 197, 94); // Green
    } else if (feedback.totalScore >= 60) {
      pdf.setTextColor(251, 191, 36); // Yellow
    } else {
      pdf.setTextColor(239, 68, 68); // Red
    }

    pdf.text(`Total Score: ${feedback.totalScore}/100`, margin, yPosition);
    pdf.setTextColor(0, 0, 0); // Reset to black

    yPosition += 25;

    // Category Scores
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detailed Assessment", margin, yPosition);

    yPosition += 15;

    feedback.categoryScores.forEach((category) => {
      if (yPosition > 250) {
        // New page if needed
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${category.name}: ${category.score}/100`, margin, yPosition);

      yPosition += 10;
      pdf.setFont("helvetica", "normal");

      // Split long comments into multiple lines
      const commentLines = pdf.splitTextToSize(
        category.comment,
        pageWidth - 2 * margin
      );
      pdf.text(commentLines, margin + 10, yPosition);
      yPosition += commentLines.length * 5 + 10;
    });

    // Add new page for strengths and improvements
    pdf.addPage();
    yPosition = 30;

    // Strengths
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(34, 197, 94); // Green
    pdf.text("💪 Key Strengths", margin, yPosition);
    pdf.setTextColor(0, 0, 0); // Reset to black

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    feedback.strengths.forEach((strength, index) => {
      const strengthLines = pdf.splitTextToSize(
        `${index + 1}. ${strength}`,
        pageWidth - 2 * margin
      );
      pdf.text(strengthLines, margin, yPosition);
      yPosition += strengthLines.length * 5 + 5;
    });

    yPosition += 15;

    // Areas for Improvement
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(239, 68, 68); // Red
    pdf.text("🎯 Areas for Improvement", margin, yPosition);
    pdf.setTextColor(0, 0, 0); // Reset to black

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    feedback.areasForImprovement.forEach((improvement, index) => {
      if (yPosition > 250) {
        // New page if needed
        pdf.addPage();
        yPosition = 30;
      }
      const improvementLines = pdf.splitTextToSize(
        `${index + 1}. ${improvement}`,
        pageWidth - 2 * margin
      );
      pdf.text(improvementLines, margin, yPosition);
      yPosition += improvementLines.length * 5 + 5;
    });

    yPosition += 15;

    // Final Assessment
    if (yPosition > 200) {
      // New page if needed
      pdf.addPage();
      yPosition = 30;
    }

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("📋 Final Assessment", margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    const assessmentLines = pdf.splitTextToSize(
      feedback.finalAssessment,
      pageWidth - 2 * margin
    );
    pdf.text(assessmentLines, margin, yPosition);

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(
        `VinPrep Interview Report - Page ${i} of ${pageCount}`,
        pageWidth - margin - 50,
        (pdf as any).internal.pageSize.getHeight() - 10
      );
    }

    // Download the PDF
    const fileName = `VinPrep_Interview_Report_${interview.role}_${
      new Date(feedback.createdAt).toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
}
