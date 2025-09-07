import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { testEmail, testName } = await request.json();
    
    console.log("Testing Firebase user schema...");
    
    // Test 1: Check Firebase Admin connection
    console.log("1. Testing Firebase Admin connection...");
    const testDoc = await db.collection("_test").doc("connection").get();
    console.log("✅ Firestore Admin connection working");
    
    // Test 2: Test user document creation with all required fields
    console.log("2. Testing user document creation...");
    const testUserId = "test-user-" + Date.now();
    const testUserData = {
      name: testName || "Test User",
      email: testEmail || "test@example.com",
      interviewCount: 0,
      questionCount: 0,
      createdAt: new Date().toISOString(),
      // Additional fields that might be expected
      profileURL: null,
      resumeURL: null,
    };
    
    // Try to create user document
    await db.collection("users").doc(testUserId).set(testUserData);
    console.log("✅ User document created successfully");
    
    // Test 3: Verify user document was created correctly
    const createdUser = await db.collection("users").doc(testUserId).get();
    if (!createdUser.exists) {
      throw new Error("User document was not created properly");
    }
    
    const userData = createdUser.data();
    console.log("✅ User document verified:", userData);
    
    // Test 4: Test getCurrentUser function simulation
    const userWithId = {
      ...userData,
      id: testUserId,
    };
    console.log("✅ User object with ID:", userWithId);
    
    // Clean up test user
    await db.collection("users").doc(testUserId).delete();
    console.log("✅ Test user cleaned up");
    
    return NextResponse.json({
      success: true,
      message: "Firebase user schema test successful",
      testResults: {
        adminConnection: "✅ Working",
        userCreation: "✅ Working", 
        userRetrieval: "✅ Working",
        cleanup: "✅ Working"
      },
      userSchema: testUserData,
      retrievedUser: userWithId
    });
    
  } catch (error: any) {
    console.error("Firebase user schema test failed:", error);
    
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
    message: "POST to test Firebase user schema",
    usage: "POST { testEmail: 'test@example.com', testName: 'Test User' }"
  });
}
