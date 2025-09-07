/**
 * Utility script to migrate existing users to have interview and question count statistics
 * This should be run once after deploying the user stats feature
 */

import { migrateAllUserStats } from "@/lib/actions/user-stats.action";

export async function runUserStatsMigration() {
  console.log("Starting user stats migration...");
  
  try {
    const result = await migrateAllUserStats();
    
    if (result.success) {
      console.log(`✅ Successfully migrated ${result.migratedCount} users`);
      return {
        success: true,
        message: `Migration completed. ${result.migratedCount} users were migrated.`
      };
    } else {
      console.error("❌ Migration failed:", result.error);
      return {
        success: false,
        message: `Migration failed: ${result.error}`
      };
    }
  } catch (error) {
    console.error("❌ Migration error:", error);
    return {
      success: false,
      message: `Migration error: ${error}`
    };
  }
}

// If running this script directly
if (require.main === module) {
  runUserStatsMigration()
    .then((result) => {
      console.log(result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Script error:", error);
      process.exit(1);
    });
}
