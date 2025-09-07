import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/firebase/admin";

export async function GET() {
  try {
    console.log("=== FIREBASE CONNECTION TEST ===");
    
    // Test 1: Check environment variables
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    };
    
    console.log("Environment variables:", envCheck);
    
    // Test 2: Try to access Firestore
    const testDoc = await db.collection("test").doc("connection").get();
    console.log("Firestore access: SUCCESS");
    
    // Test 3: Try to list users (just to test auth)
    try {
      const listUsersResult = await auth.listUsers(1);
      console.log("Firebase Auth access: SUCCESS");
    } catch (authError) {
      console.log("Firebase Auth access: FAILED", authError);
    }
    
    return NextResponse.json({
      success: true,
      message: "Firebase connection successful",
      environment: envCheck,
      firestore: "Connected",
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("=== FIREBASE CONNECTION ERROR ===");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      message: "Firebase connection failed",
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
