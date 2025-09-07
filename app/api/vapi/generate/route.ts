import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { generateEnhancedInterviewPrompt } from "@/constants/interview-training";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const techStackArray = techstack.split(",").map((tech: string) => tech.trim());
    const enhancedPrompt = generateEnhancedInterviewPrompt(type, level, role, techStackArray);

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are an expert interview question generator with deep knowledge across multiple industries and technical domains.

${enhancedPrompt}

TASK: Generate exactly ${amount} high-quality interview questions that:

1. **Match the specified criteria:**
   - Role: ${role}
   - Experience Level: ${level}
   - Interview Type: ${type}
   - Tech Stack: ${techstack}

2. **Follow these quality standards:**
   - Questions should be realistic and commonly asked in actual interviews
   - Vary in difficulty and approach (behavioral, technical, scenario-based)
   - Avoid overly generic questions like "Tell me about yourself"
   - Include questions that reveal both technical competency and soft skills
   - Be specific enough to generate meaningful discussions

3. **Voice Assistant Compatibility:**
   - Use simple, clear language that works well with voice synthesis
   - Avoid special characters like /, *, #, @, etc.
   - Keep questions conversational and natural
   - Ensure questions can be easily understood when spoken

4. **Output Format:**
   Return ONLY a valid JSON array of questions, like this:
   ["Question 1", "Question 2", "Question 3"]

Generate exactly ${amount} questions following these guidelines.`,
    });

    const parsedQuestions = JSON.parse(questions);

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techStackArray,
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    // Stats will be updated when the interview is completed and feedback is created
    // This ensures we only count actually completed interviews, not just generated ones

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
