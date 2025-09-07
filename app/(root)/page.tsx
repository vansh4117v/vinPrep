import Dashboard from "@/components/Dashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import {
  getDashboardStats,
  getSkillsProgress,
  getPerformanceTrends,
  getUserAchievements,
  getPracticeRecommendations,
} from "@/lib/actions/analytics.action";

async function Home() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Please sign in to view your dashboard
            </h1>
            <p className="text-purple-300">
              You need to be logged in to access this page.
            </p>
          </div>
        </div>
      );
    }

    const [
      userInterviews,
      allInterview,
      dashboardStats,
      skillsProgress,
      performanceTrends,
      achievements,
      recommendations,
    ] = await Promise.all([
      getInterviewsByUserId(user.id).catch(() => []),
      getLatestInterviews({ userId: user.id }).catch(() => []),
      getDashboardStats(user.id).catch(() => ({
        totalInterviews: 0,
        completedInterviews: 0,
        successRate: 0,
        averageScore: 0,
        practiceTime: 0,
        weeklyGrowth: 0,
        monthlyGrowth: 0,
        scoreImprovement: 0,
      })),
      getSkillsProgress(user.id).catch(() => []),
      getPerformanceTrends(user.id).catch(() => []),
      getUserAchievements(user.id).catch(() => []),
      getPracticeRecommendations(user.id).catch(() => []),
    ]);

    return (
      <div className="mx-auto max-w-7xl flex-col gap-16 pt-0 pb-8 px-8 max-sm:px-4">
        <ErrorBoundary>
          <Dashboard
            user={user}
            userInterviews={userInterviews || []}
            recentInterviews={allInterview || []}
            dashboardStats={dashboardStats}
            skillsProgress={skillsProgress}
            performanceTrends={performanceTrends}
            achievements={achievements}
            recommendations={recommendations}
          />
        </ErrorBoundary>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-purple-300 mb-6">
            There was an error loading your dashboard.
          </p>
          <a
            href="/"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
