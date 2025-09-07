"use server";

import { db } from "@/firebase/admin";
import { getUserStats } from "@/lib/actions/user-stats.action";

// Import types from the types file
interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
  userId: string;
}

export interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  successRate: number;
  averageScore: number;
  practiceTime: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  scoreImprovement: number;
  totalQuestions?: number;
}

export interface SkillProgress {
  skill: string;
  progress: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  improvement: number;
}

export interface PerformanceTrend {
  period: string;
  score: number;
  improvement: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: "milestone" | "streak" | "performance" | "skill";
}

// Get comprehensive dashboard statistics
export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  try {
    // Get all user interviews and user stats in parallel
    const [interviewsSnapshot, feedbackSnapshot, userStats] = await Promise.all([
      db.collection("interviews").where("userId", "==", userId).get(),
      db.collection("feedback").where("userId", "==", userId).get(),
      getUserStats(userId)
    ]);

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    const feedbacks = feedbackSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    // Use userStats for accurate counts, fallback to calculated values
    const totalInterviews = userStats?.interviewCount ?? interviews.length;
    const totalQuestions = userStats?.questionCount ?? 
      interviews.reduce((sum, interview) => sum + (interview.questions?.length || 0), 0);
    
    const completedInterviews = interviews.filter(
      (interview) => interview.finalized
    ).length;
    const successRate =
      totalInterviews > 0
        ? Math.round((completedInterviews / totalInterviews) * 100)
        : 0;

    // Calculate average score from feedback
    const averageScore =
      feedbacks.length > 0
        ? Math.round(
            feedbacks.reduce((sum, feedback) => sum + feedback.totalScore, 0) /
              feedbacks.length
          )
        : 0;

    // Calculate practice time (estimate based on interviews)
    const practiceTime = completedInterviews * 25; // Assume 25 minutes per interview

    // Calculate weekly and monthly growth
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekInterviews = interviews.filter(
      (interview) => new Date(interview.createdAt) >= weekAgo
    ).length;

    const thisMonthInterviews = interviews.filter(
      (interview) => new Date(interview.createdAt) >= monthAgo
    ).length;

    const weeklyGrowth = thisWeekInterviews;
    const monthlyGrowth = Math.round(
      (thisMonthInterviews /
        Math.max(totalInterviews - thisMonthInterviews, 1)) *
        100
    );

    // Calculate score improvement
    const recentFeedbacks = feedbacks
      .filter((feedback) => new Date(feedback.createdAt) >= monthAgo)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const scoreImprovement =
      recentFeedbacks.length >= 2
        ? recentFeedbacks[recentFeedbacks.length - 1].totalScore -
          recentFeedbacks[0].totalScore
        : 0;

    return {
      totalInterviews,
      completedInterviews,
      successRate,
      averageScore,
      practiceTime,
      weeklyGrowth,
      monthlyGrowth,
      scoreImprovement,
      totalQuestions,
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      successRate: 0,
      averageScore: 0,
      practiceTime: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      scoreImprovement: 0,
      totalQuestions: 0,
    };
  }
}

// Get skills progress based on feedback categories
export async function getSkillsProgress(
  userId: string
): Promise<SkillProgress[]> {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    const feedbacks = feedbackSnapshot.docs.map((doc) =>
      doc.data()
    ) as Feedback[];

    if (feedbacks.length === 0) {
      return [
        {
          skill: "Technical Questions",
          progress: 0,
          level: "Beginner",
          improvement: 0,
        },
        {
          skill: "Behavioral Questions",
          progress: 0,
          level: "Beginner",
          improvement: 0,
        },
        {
          skill: "System Design",
          progress: 0,
          level: "Beginner",
          improvement: 0,
        },
        {
          skill: "Problem Solving",
          progress: 0,
          level: "Beginner",
          improvement: 0,
        },
        {
          skill: "Communication",
          progress: 0,
          level: "Beginner",
          improvement: 0,
        },
      ];
    }

    // Calculate average scores for each category
    const skillCategories = [
      "Technical Knowledge",
      "Communication Skills",
      "Problem-Solving",
      "Cultural & Role Fit",
      "Confidence & Clarity",
    ];

    const skillMapping = {
      "Technical Knowledge": "Technical Questions",
      "Communication Skills": "Behavioral Questions",
      "Problem-Solving": "System Design",
      "Cultural & Role Fit": "Problem Solving",
      "Confidence & Clarity": "Communication",
    };

    const skillsProgress: SkillProgress[] = [];

    for (const category of skillCategories) {
      const categoryScores = feedbacks
        .flatMap((feedback) => feedback.categoryScores)
        .filter((score) => score.name === category)
        .map((score) => score.score);

      if (categoryScores.length > 0) {
        const averageScore =
          categoryScores.reduce((sum, score) => sum + score, 0) /
          categoryScores.length;

        // Calculate improvement (compare first half vs second half of attempts)
        const midPoint = Math.floor(categoryScores.length / 2);
        const firstHalf = categoryScores.slice(0, midPoint);
        const secondHalf = categoryScores.slice(midPoint);

        const improvement =
          secondHalf.length > 0 && firstHalf.length > 0
            ? secondHalf.reduce((sum, score) => sum + score, 0) /
                secondHalf.length -
              firstHalf.reduce((sum, score) => sum + score, 0) /
                firstHalf.length
            : 0;

        const level =
          averageScore >= 90
            ? "Expert"
            : averageScore >= 75
            ? "Advanced"
            : averageScore >= 50
            ? "Intermediate"
            : "Beginner";

        skillsProgress.push({
          skill:
            skillMapping[category as keyof typeof skillMapping] || category,
          progress: Math.round(averageScore),
          level,
          improvement: Math.round(improvement),
        });
      }
    }

    return skillsProgress;
  } catch (error) {
    console.error("Error getting skills progress:", error);
    return [];
  }
}

// Get performance trends over time
export async function getPerformanceTrends(
  userId: string
): Promise<PerformanceTrend[]> {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    const feedbacks = feedbackSnapshot.docs
      .map((doc) => doc.data() as Feedback)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    if (feedbacks.length === 0) {
      return [];
    }

    // Group by week
    const trends: PerformanceTrend[] = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(
        now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000
      );
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

      const weekFeedbacks = feedbacks.filter((feedback) => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate >= weekStart && feedbackDate < weekEnd;
      });

      if (weekFeedbacks.length > 0) {
        const averageScore =
          weekFeedbacks.reduce(
            (sum, feedback) => sum + feedback.totalScore,
            0
          ) / weekFeedbacks.length;

        const periodName =
          i === 0
            ? "This Week"
            : i === 1
            ? "Last Week"
            : i === 2
            ? "2 Weeks Ago"
            : "3 Weeks Ago";

        trends.push({
          period: periodName,
          score: Math.round(averageScore),
          improvement: 0, // Will calculate relative to previous
        });
      }
    }

    // Calculate improvements
    for (let i = 1; i < trends.length; i++) {
      trends[i].improvement = trends[i].score - trends[i - 1].score;
    }

    return trends;
  } catch (error) {
    console.error("Error getting performance trends:", error);
    return [];
  }
}

// Get user achievements
export async function getUserAchievements(
  userId: string
): Promise<Achievement[]> {
  try {
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];

    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    const feedbacks = feedbackSnapshot.docs.map((doc) =>
      doc.data()
    ) as Feedback[];

    const achievements: Achievement[] = [];

    // First Interview Achievement
    if (interviews.length > 0) {
      achievements.push({
        id: "first-interview",
        title: "First Interview",
        description: "Completed your first AI interview",
        icon: "🎯",
        unlockedAt: interviews[0].createdAt,
        category: "milestone",
      });
    }

    // High Scorer Achievement
    const highScores = feedbacks.filter(
      (feedback) => feedback.totalScore >= 85
    );
    if (highScores.length > 0) {
      achievements.push({
        id: "high-scorer",
        title: "High Scorer",
        description: "Achieved 85+ average score",
        icon: "⭐",
        unlockedAt: highScores[0].createdAt,
        category: "performance",
      });
    }

    // Consistent Learner (3+ interviews in a week)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekInterviews = interviews.filter(
      (interview) => new Date(interview.createdAt) >= weekAgo
    );

    if (thisWeekInterviews.length >= 3) {
      achievements.push({
        id: "consistent-learner",
        title: "Consistent Learner",
        description: "Practiced 3 days in a row",
        icon: "📚",
        unlockedAt: thisWeekInterviews[2].createdAt,
        category: "streak",
      });
    }

    // Interview Master (10+ completed interviews)
    const completedInterviews = interviews.filter(
      (interview) => interview.finalized
    );
    if (completedInterviews.length >= 10) {
      achievements.push({
        id: "interview-master",
        title: "Interview Master",
        description: "Completed 10+ interviews",
        icon: "🏆",
        unlockedAt: completedInterviews[9].createdAt,
        category: "milestone",
      });
    }

    // Improvement Champion (20+ point improvement)
    if (feedbacks.length >= 2) {
      const sortedFeedbacks = feedbacks.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const improvement =
        sortedFeedbacks[sortedFeedbacks.length - 1].totalScore -
        sortedFeedbacks[0].totalScore;

      if (improvement >= 20) {
        achievements.push({
          id: "improvement-champion",
          title: "Improvement Champion",
          description: "Improved score by 20+ points",
          icon: "📈",
          unlockedAt: sortedFeedbacks[sortedFeedbacks.length - 1].createdAt,
          category: "performance",
        });
      }
    }

    return achievements.sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    );
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return [];
  }
}

// Get practice recommendations based on performance
export async function getPracticeRecommendations(userId: string): Promise<
  {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    category: string;
  }[]
> {
  try {
    const skillsProgress = await getSkillsProgress(userId);
    const recommendations = [];

    // Find lowest performing skills
    const lowestSkill = skillsProgress.reduce((min, skill) =>
      skill.progress < min.progress ? skill : min
    );

    if (lowestSkill.progress < 70) {
      recommendations.push({
        title: `Focus on ${lowestSkill.skill}`,
        description: `Your ${lowestSkill.skill.toLowerCase()} score needs improvement. Practice with targeted questions.`,
        priority: "high" as const,
        category: lowestSkill.skill,
      });
    }

    // Behavioral improvement for intermediate users
    const behavioralSkill = skillsProgress.find(
      (skill) => skill.skill === "Behavioral Questions"
    );
    if (behavioralSkill && behavioralSkill.progress < 80) {
      recommendations.push({
        title: "Strengthen Behavioral Responses",
        description:
          "Practice the STAR method for better storytelling in behavioral interviews.",
        priority: "medium" as const,
        category: "Behavioral",
      });
    }

    // System design for advanced users
    const technicalSkill = skillsProgress.find(
      (skill) => skill.skill === "Technical Questions"
    );
    if (technicalSkill && technicalSkill.progress >= 80) {
      recommendations.push({
        title: "Master System Design",
        description:
          "Take on complex architectural challenges to reach expert level.",
        priority: "medium" as const,
        category: "Technical",
      });
    }

    return recommendations;
  } catch (error) {
    console.error("Error getting practice recommendations:", error);
    return [];
  }
}
