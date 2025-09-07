"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import {
  incrementUserInterviewCount,
  incrementUserQuestionCount,
  initializeUserStats,
} from "@/lib/actions/user-stats.action";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) => `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `
        You are an expert interview analyst with extensive experience in talent assessment and professional development. Analyze this mock interview transcript with the precision and insight of a senior HR professional and industry expert.

        TRANSCRIPT ANALYSIS:
        ${formattedTranscript}

        EVALUATION FRAMEWORK:
        Conduct a comprehensive assessment using advanced interview analysis techniques:

        **COMMUNICATION SKILLS (0-100):**
        - Clarity and articulation of thoughts
        - Structure and organization of responses
        - Active listening and question comprehension
        - Professional language usage
        - Ability to explain complex concepts simply

        **TECHNICAL KNOWLEDGE (0-100):**
        - Depth of understanding in relevant technologies/concepts
        - Practical application knowledge
        - Problem-solving methodology
        - Industry best practices awareness
        - Ability to discuss technical trade-offs

        **PROBLEM-SOLVING (0-100):**
        - Analytical thinking approach
        - Creative solution generation
        - Logical reasoning process
        - Handling of ambiguous scenarios
        - Learning agility demonstration

        **CULTURAL & ROLE FIT (0-100):**
        - Alignment with professional values
        - Team collaboration indicators
        - Leadership potential signs
        - Adaptability and growth mindset
        - Work ethic and motivation

        **CONFIDENCE & CLARITY (0-100):**
        - Self-assurance without arrogance
        - Composure under pressure
        - Honest acknowledgment of limitations
        - Enthusiasm and engagement level
        - Professional presence

        ANALYSIS REQUIREMENTS:
        - Provide specific examples from the transcript to support scores
        - Identify both explicit and implicit behavioral indicators
        - Note patterns in communication and thought processes
        - Assess consistency across different question types
        - Consider industry-specific expectations and standards

        FEEDBACK QUALITY:
        - Be constructive but honest in assessment
        - Provide actionable improvement suggestions
        - Recognize genuine strengths and potential
        - Balance criticism with encouragement
        - Focus on professional development opportunities
        `,
      system:
        "You are a senior interview analyst and talent assessment expert. Provide detailed, professional feedback that helps candidates understand their performance and improve their interview skills.",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    // Update user statistics when feedback is created (interview completed)
    // Always update stats for completed interviews
    try {
      console.log("🔄 Updating user stats for completed interview...");
      console.log("📊 Interview ID:", interviewId);
      console.log("👤 User ID:", userId);
      console.log("📝 Feedback ID:", feedbackId);

      // Initialize user stats if they don't exist
      console.log("🏗️ Initializing user stats...");
      await initializeUserStats(userId);

      // Get the interview to know how many questions were asked
      const interview = await getInterviewById(interviewId);
      const questionCount = interview?.questions?.length || 0;

      console.log("❓ Question count:", questionCount);

      // Update user stats - this represents a completed interview
      console.log("⬆️ Incrementing interview count...");
      const interviewResult = await incrementUserInterviewCount(userId);
      console.log("✅ Interview count result:", interviewResult);

      if (questionCount > 0) {
        console.log("⬆️ Incrementing question count...");
        const questionResult = await incrementUserQuestionCount(userId, questionCount);
        console.log("✅ Question count result:", questionResult);
      }

      console.log("🎉 User stats updated successfully!");
    } catch (statsError) {
      console.error("❌ Error updating user stats:", statsError);
      // Don't fail the feedback creation if stats update fails
    }

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    // If composite index is not available, fall back to filtering in memory
    console.log("Falling back to client-side filtering for feedback");

    const allFeedback = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();

    const matchingFeedback = allFeedback.docs.find((doc) => doc.data().userId === userId);

    if (!matchingFeedback) return null;

    return { id: matchingFeedback.id, ...matchingFeedback.data() } as Feedback;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  try {
    // Try the optimized query first
    const interviews = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    // If composite index is not available, fall back to filtering in memory
    console.log("Falling back to client-side filtering for latest interviews");

    const interviews = await db.collection("interviews").where("finalized", "==", true).get();

    const interviewsData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    const filteredInterviews = interviewsData
      .filter((interview) => interview.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return filteredInterviews;
  }
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
  try {
    // Try the optimized query first
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    // If index is not available, fall back to client-side sorting
    console.log("Falling back to client-side sorting for user interviews");

    const interviews = await db.collection("interviews").where("userId", "==", userId).get();

    const interviewsData = interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    // Sort by createdAt in descending order (newest first)
    return interviewsData.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
