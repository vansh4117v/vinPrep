import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/firebase/admin";

export async function GET() {
  try {
    // Test Firebase Admin connection
    console.log("Testing Firebase Admin connection...");
    
    // Test Firestore connection
    const testDoc = await db.collection("_test").doc("connection-test").get();
    console.log("Firestore connection: OK");
    
    // Test Auth connection  
    const users = await auth.listUsers(1);
    console.log("Auth connection: OK");
    
    return NextResponse.json({
      success: true,
      message: "Firebase Admin SDK is working properly",
      firestore: "Connected",
      auth: "Connected",
      userCount: users.users.length
    });
  } catch (error: any) {
    console.error("Firebase Admin test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: "Use GET to test Firebase connection"
  });
}
