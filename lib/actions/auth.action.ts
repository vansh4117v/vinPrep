"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    console.log("=== FIREBASE SIGNUP DEBUG ===");
    console.log("Server signUp called for user:", { uid, name, email });
    console.log("Environment check:", {
      projectId: process.env.FIREBASE_PROJECT_ID ? "✓" : "✗",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "✓" : "✗", 
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? "✓" : "✗"
    });

    // Test Firebase Admin connection
    console.log("Testing Firebase Admin connection...");
    
    // check if user exists in db
    console.log("Checking if user exists in database...");
    const userRecord = await db.collection("users").doc(uid).get();
    console.log("User lookup successful. User exists:", userRecord.exists);
    
    if (userRecord.exists) {
      console.log("User already exists in database:", uid);
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    console.log("Creating new user document in Firestore");
    const userData = {
      name,
      email,
      interviewCount: 0,
      questionCount: 0,
      createdAt: new Date().toISOString(),
      profileURL: null,
      resumeURL: null,
    };
    
    console.log("User data to be saved:", userData);

    // save user to db
    await db.collection("users").doc(uid).set(userData);

    console.log("User successfully created in database:", uid);

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("=== FIREBASE SIGNUP ERROR ===");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      name: error.name
    });

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    if (error.code === "permission-denied") {
      return {
        success: false,
        message: "Permission denied. Please check Firebase security rules.",
      };
    }

    if (error.message?.includes("serviceAccountKey")) {
      return {
        success: false,
        message: "Firebase configuration error. Please check environment variables.",
      };
    }

    return {
      success: false,
      message: `Failed to create account: ${error.message || "Please try again."}`,
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    console.log("Server signIn called for user:", email);

    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      console.log("User not found in Firebase Auth:", email);
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    console.log("Setting session cookie for user:", userRecord.uid);
    await setSessionCookie(idToken);

    console.log("Sign in successful for user:", email);
    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error: any) {
    console.error("Sign in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
