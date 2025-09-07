import { NextRequest, NextResponse } from "next/server";
import { migrateAllUserStats } from "@/lib/actions/user-stats.action";

export async function POST(request: NextRequest) {
  try {
    // Add basic authentication or admin check here if needed
    // For now, we'll just run the migration
    
    const result = await migrateAllUserStats();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully migrated ${result.migratedCount} users`,
        migratedCount: result.migratedCount
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Migration endpoint error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "User stats migration endpoint. Use POST to run migration."
  });
}
