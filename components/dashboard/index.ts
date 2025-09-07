// Export all dashboard-related utilities and components
export { default as Dashboard } from "../Dashboard";
export {
  StartInterviewModal,
  PracticeSkillsModal,
  ScheduleSessionModal,
  ViewAnalyticsModal,
} from "../DashboardModals";
export { RefreshDashboard } from "../RefreshDashboard";
export { default as DashboardLoading } from "../DashboardLoading";

// Export constants
export {
  INTERVIEW_TYPES,
  SKILL_CATEGORIES,
  PRACTICE_SESSIONS,
} from "../../constants/dashboard";

// Export analytics actions
export {
  getDashboardStats,
  getSkillsProgress,
  getPerformanceTrends,
  getUserAchievements,
  getPracticeRecommendations,
} from "../../lib/actions/analytics.action";

// Types
export interface DashboardData {
  user: any;
  userInterviews: any[];
  recentInterviews: any[];
  dashboardStats: any;
  skillsProgress: any[];
  performanceTrends: any[];
  achievements: any[];
  recommendations: any[];
}
