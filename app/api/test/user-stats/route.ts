import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  incrementUserInterviewCount,
  incrementUserQuestionCount,
  initializeUserStats,
  getUserStats,
} from "@/lib/actions/user-stats.action";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { action, questionCount } = await request.json();

    console.log("🧪 Testing user stats for user:", user.id);
    console.log("🧪 Action:", action);

    let result;

    switch (action) {
      case "initialize":
        result = await initializeUserStats(user.id);
        break;
      case "increment-interview":
        result = await incrementUserInterviewCount(user.id);
        break;
      case "increment-questions":
        result = await incrementUserQuestionCount(user.id, questionCount || 5);
        break;
      case "get-stats":
        result = await getUserStats(user.id);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    console.log("🧪 Test result:", result);

    return NextResponse.json({
      success: true,
      action,
      result,
      userId: user.id,
    });
  } catch (error) {
    console.error("❌ Test endpoint error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const stats = await getUserStats(user.id);

    return NextResponse.json({
      success: true,
      userId: user.id,
      stats,
    });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get user stats",
      },
      { status: 500 }
    );
  }
}
