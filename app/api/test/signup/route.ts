import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    console.log("Test signup for:", email, name);
    
    // Test creating a user directly in Firestore
    const testUser = {
      name: name || "Test User",
      email: email || "test@example.com",
      interviewCount: 0,
      questionCount: 0,
      createdAt: new Date().toISOString(),
      testUser: true
    };
    
    // Try to write to Firestore
    const docRef = db.collection("users").doc("test-user-" + Date.now());
    await docRef.set(testUser);
    
    console.log("Test user created successfully in Firestore");
    
    // Clean up test user
    await docRef.delete();
    console.log("Test user cleaned up");
    
    return NextResponse.json({
      success: true,
      message: "Firestore write test successful",
      testUser
    });
    
  } catch (error: any) {
    console.error("Test signup failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to test Firestore user creation",
    usage: "POST { email: 'test@example.com', name: 'Test User' }"
  });
}
