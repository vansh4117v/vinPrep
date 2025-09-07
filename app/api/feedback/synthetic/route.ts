import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { userId, estimatedQuestions } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Generate a realistic synthetic score
    const baseScore = 75 + Math.floor(Math.random() * 20); // Random score between 75-95

    const syntheticFeedback = {
      userId: userId,
      interviewId: "generate-" + Date.now(), // Synthetic interview ID
      totalScore: baseScore,
      categoryScores: [
        {
          name: "Technical Knowledge",
          score: Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5))),
          comment: "Demonstrated solid technical understanding",
        },
        {
          name: "Communication Skills",
          score: Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5))),
          comment: "Clear and effective communication",
        },
        {
          name: "Problem-Solving",
          score: Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5))),
          comment: "Good analytical and problem-solving approach",
        },
        {
          name: "Cultural & Role Fit",
          score: Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5))),
          comment: "Shows good alignment with role requirements",
        },
        {
          name: "Confidence & Clarity",
          score: Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5))),
          comment: "Confident and clear in responses",
        },
      ],
      strengths: [
        "Good technical knowledge",
        "Clear communication skills",
        "Strong problem-solving abilities",
        "Professional demeanor",
      ],
      areasForImprovement: [
        "Continue practicing technical concepts",
        "Expand knowledge in specific areas",
        "Keep building confidence through practice",
      ],
      finalAssessment: `Overall strong performance in the interview session. Answered ${estimatedQuestions} questions with good technical depth and clear communication. Continue practicing to further enhance your interview skills.`,
      createdAt: new Date().toISOString(),
    };

    // Save synthetic feedback to database
    const feedbackRef = await db.collection("feedback").add(syntheticFeedback);

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRef.id,
      score: baseScore,
    });
  } catch (error) {
    console.error("Error creating synthetic feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create synthetic feedback",
      },
      { status: 500 }
    );
  }
}
