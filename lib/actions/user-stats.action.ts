"use server";

import { db } from "@/firebase/admin";

/**
 * Increment the interview count for a user
 */
export async function incrementUserInterviewCount(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }
    
    const userData = userDoc.data();
    const currentCount = userData?.interviewCount || 0;
    
    await userRef.update({
      interviewCount: currentCount + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing interview count:", error);
    return { success: false, error: "Failed to update interview count" };
  }
}

/**
 * Increment the question count for a user
 */
export async function incrementUserQuestionCount(userId: string, questionCount: number = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }
    
    const userData = userDoc.data();
    const currentCount = userData?.questionCount || 0;
    
    await userRef.update({
      questionCount: currentCount + questionCount
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error incrementing question count:", error);
    return { success: false, error: "Failed to update question count" };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string): Promise<{ interviewCount: number; questionCount: number } | null> {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    return {
      interviewCount: userData?.interviewCount || 0,
      questionCount: userData?.questionCount || 0
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
}

/**
 * Initialize user stats (for existing users)
 */
export async function initializeUserStats(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return { success: false, error: "User not found" };
    }
    
    const userData = userDoc.data();
    
    // Only initialize if fields don't exist
    const updates: any = {};
    if (userData?.interviewCount === undefined) {
      updates.interviewCount = 0;
    }
    if (userData?.questionCount === undefined) {
      updates.questionCount = 0;
    }
    
    if (Object.keys(updates).length > 0) {
      await userRef.update(updates);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error initializing user stats:", error);
    return { success: false, error: "Failed to initialize user stats" };
  }
}

/**
 * Reset user stats (admin function)
 */
export async function resetUserStats(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({
      interviewCount: 0,
      questionCount: 0
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error resetting user stats:", error);
    return { success: false, error: "Failed to reset user stats" };
  }
}

/**
 * Migrate existing users to have interview and question counts
 * This will count their existing interviews and questions
 */
export async function migrateUserStats(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get all interviews for this user
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();
    
    let totalQuestions = 0;
    const interviewCount = interviewsSnapshot.size;
    
    // Count total questions from all interviews
    interviewsSnapshot.forEach((doc) => {
      const interview = doc.data();
      if (interview.questions && Array.isArray(interview.questions)) {
        totalQuestions += interview.questions.length;
      }
    });
    
    // Update user document
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      interviewCount,
      questionCount: totalQuestions
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error migrating user stats:", error);
    return { success: false, error: "Failed to migrate user stats" };
  }
}

/**
 * Migrate all existing users to have stats
 */
export async function migrateAllUserStats(): Promise<{ success: boolean; migratedCount: number; error?: string }> {
  try {
    const usersSnapshot = await db.collection("users").get();
    let migratedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Only migrate users that don't already have stats
      if (userData.interviewCount === undefined || userData.questionCount === undefined) {
        await migrateUserStats(userDoc.id);
        migratedCount++;
      }
    }
    
    return { success: true, migratedCount };
  } catch (error) {
    console.error("Error migrating all user stats:", error);
    return { success: false, migratedCount: 0, error: "Failed to migrate user stats" };
  }
}
