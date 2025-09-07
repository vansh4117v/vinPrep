"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  StartInterviewModal,
  PracticeSkillsModal,
  ScheduleSessionModal,
  ViewAnalyticsModal,
} from "@/components/DashboardModals";
import { RefreshDashboard } from "@/components/RefreshDashboard";
import DashboardPDFDownload from "@/components/DashboardPDFDownload";
import UserStatsCard from "@/components/UserStatsCard";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Star,
  ChevronRight,
  Calendar,
  Award,
  Zap,
  Brain,
  PlayCircle,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Trophy,
  Loader2,
} from "lucide-react";

interface DashboardProps {
  user: any;
  userInterviews: any[];
  recentInterviews: any[];
  dashboardStats: any;
  skillsProgress: any[];
  performanceTrends: any[];
  achievements: any[];
  recommendations: any[];
}

const Dashboard = ({
  user,
  userInterviews,
  recentInterviews,
  dashboardStats,
  skillsProgress,
  performanceTrends,
  achievements,
  recommendations,
}: DashboardProps) => {
  // Use actual data from analytics with fallbacks
  const totalInterviews = dashboardStats?.totalInterviews || 0;
  const completedInterviews = dashboardStats?.completedInterviews || 0;
  const successRate = dashboardStats?.successRate || 0;
  const averageScore = dashboardStats?.averageScore || 0;
  const practiceTime = dashboardStats?.practiceTime || 0;
  const weeklyGrowth = dashboardStats?.weeklyGrowth || 0;
  const monthlyGrowth = dashboardStats?.monthlyGrowth || 0;
  const scoreImprovement = dashboardStats?.scoreImprovement || 0;

  // Get recent activity with fallback
  const recentActivity = userInterviews?.slice(0, 5) || [];

  // Format practice time with error handling
  const formatPracticeTime = (minutes: number) => {
    try {
      if (!minutes || minutes < 0) return "0m";
      if (minutes < 60) return `${minutes}m`;
      const hours = Math.floor(minutes / 60);
      return hours >= 24 ? `${Math.floor(hours / 24)}d` : `${hours}h`;
    } catch (error) {
      console.error("Error formatting practice time:", error);
      return "0m";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Welcome back, {user?.name || "Candidate"}! 👋
            </h1>
            <p className="text-purple-200/80">
              Continue your interview preparation journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshDashboard />
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              <Link href="/interview">
                <PlayCircle className="mr-2 h-4 w-4" />
                Start New Interview
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">
                Total Interviews
              </CardTitle>
              <Target className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalInterviews}
              </div>
              <p className="text-xs text-purple-300 mt-1">
                +{weeklyGrowth} from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {successRate}%
              </div>
              <p className="text-xs text-cyan-300 mt-1">
                +{monthlyGrowth > 0 ? monthlyGrowth : 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border-emerald-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-200">
                Average Score
              </CardTitle>
              <Star className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {averageScore}/100
              </div>
              <p className="text-xs text-emerald-300 mt-1">
                {scoreImprovement > 0 ? "+" : ""}
                {scoreImprovement} points{" "}
                {scoreImprovement >= 0 ? "improved" : "to improve"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-200">
                Practice Time
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatPracticeTime(practiceTime)}
              </div>
              <p className="text-xs text-orange-300 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple-500/30"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-purple-500/30"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="interviews"
              className="data-[state=active]:bg-purple-500/30"
            >
              Interviews
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-purple-500/30"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Statistics */}
            <UserStatsCard userId={user?.id || ""} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((interview, index) => (
                      <div
                        key={interview.id || index}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">
                              {interview.role} Interview
                            </p>
                            <p className="text-sm text-purple-300">
                              {new Date(
                                interview.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-purple-400 text-purple-300"
                        >
                          {interview.type}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                      <p className="text-purple-200">No interviews yet</p>
                      <p className="text-sm text-purple-400">
                        Start your first interview to see activity here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <StartInterviewModal />
                  <PracticeSkillsModal />
                  <ViewAnalyticsModal
                    userInterviews={userInterviews}
                    achievements={achievements}
                  />
                  <ScheduleSessionModal />
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="bg-slate-800/50 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements && achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {achievements.slice(0, 3).map((achievement, index) => (
                      <div
                        key={achievement.id || index}
                        className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="text-white font-medium">
                            {achievement.title}
                          </p>
                          <p className="text-sm text-yellow-300">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <Award className="h-8 w-8 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">
                          First Interview
                        </p>
                        <p className="text-sm text-yellow-300">
                          Complete your first AI interview
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <CheckCircle className="h-8 w-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">
                          Consistent Learner
                        </p>
                        <p className="text-sm text-purple-300">
                          Practice 3 days in a row
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <Star className="h-8 w-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">High Scorer</p>
                        <p className="text-sm text-cyan-300">
                          Achieve 85+ average score
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Skills Progress */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Skills Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillsProgress && skillsProgress.length > 0 ? (
                  skillsProgress.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {skill.skill}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`border-purple-400 ${
                              skill.level === "Expert"
                                ? "text-green-300 border-green-400"
                                : skill.level === "Advanced"
                                ? "text-blue-300 border-blue-400"
                                : "text-purple-300 border-purple-400"
                            }`}
                          >
                            {skill.level}
                          </Badge>
                          <span className="text-purple-300">
                            {skill.progress}%
                          </span>
                        </div>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                    <p className="text-purple-200">No skill data yet</p>
                    <p className="text-sm text-purple-400">
                      Complete interviews to see your progress
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Recommendations */}
            <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-400" />
                  Recommended Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <Alert
                      key={index}
                      className={`${
                        rec.priority === "high"
                          ? "bg-red-500/10 border-red-500/30"
                          : rec.priority === "medium"
                          ? "bg-cyan-500/10 border-cyan-500/30"
                          : "bg-purple-500/10 border-purple-500/30"
                      }`}
                    >
                      <AlertCircle
                        className={`h-4 w-4 ${
                          rec.priority === "high"
                            ? "text-red-400"
                            : rec.priority === "medium"
                            ? "text-cyan-400"
                            : "text-purple-400"
                        }`}
                      />
                      <AlertDescription
                        className={`${
                          rec.priority === "high"
                            ? "text-red-200"
                            : rec.priority === "medium"
                            ? "text-cyan-200"
                            : "text-purple-200"
                        }`}
                      >
                        <strong>{rec.title}:</strong> {rec.description}
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <>
                    <Alert className="bg-cyan-500/10 border-cyan-500/30">
                      <AlertCircle className="h-4 w-4 text-cyan-400" />
                      <AlertDescription className="text-cyan-200">
                        Focus on System Design interviews to reach the next
                        level. Practice with complex architectural questions.
                      </AlertDescription>
                    </Alert>
                    <Alert className="bg-purple-500/10 border-purple-500/30">
                      <AlertCircle className="h-4 w-4 text-purple-400" />
                      <AlertDescription className="text-purple-200">
                        Strengthen your behavioral interview responses with the
                        STAR method for better storytelling.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            {/* Interview History */}
            <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Interview History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInterviews?.length > 0 ? (
                  <div className="space-y-4">
                    {userInterviews.map((interview, index) => (
                      <div
                        key={interview.id || index}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/ai-avatar.png" />
                            <AvatarFallback className="bg-purple-500">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">
                              {interview.role} Interview
                            </p>
                            <p className="text-sm text-purple-300">
                              {new Date(
                                interview.createdAt
                              ).toLocaleDateString()}{" "}
                              • {interview.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={
                              interview.finalized
                                ? "border-green-400 text-green-300"
                                : "border-orange-400 text-orange-300"
                            }
                          >
                            {interview.finalized ? "Completed" : "In Progress"}
                          </Badge>
                          {interview.finalized && (
                            <DashboardPDFDownload
                              interviewId={interview.id}
                              userId={user?.id || ""}
                              userName={user?.name || ""}
                              userEmail={user?.email || ""}
                              interviewRole={interview.role}
                            />
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={
                                interview.finalized
                                  ? `/interview/${interview.id}/feedback`
                                  : `/interview/${interview.id}`
                              }
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PlayCircle className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No interviews yet
                    </h3>
                    <p className="text-purple-300 mb-6">
                      Start your first interview to build your practice history
                    </p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-500 to-cyan-500"
                    >
                      <Link href="/interview">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Your First Interview
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Performance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {performanceTrends && performanceTrends.length > 0 ? (
                    <div className="space-y-4">
                      {performanceTrends.map((trend, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between">
                            <span className="text-purple-200">
                              {trend.period}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold">
                                {trend.score}%
                              </span>
                              {trend.improvement !== 0 && (
                                <span
                                  className={`text-xs ${
                                    trend.improvement > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {trend.improvement > 0 ? "+" : ""}
                                  {trend.improvement}%
                                </span>
                              )}
                            </div>
                          </div>
                          <Progress value={trend.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200">This Week</span>
                        <span className="text-white font-semibold">-</span>
                      </div>
                      <Progress value={0} className="h-2" />
                      <div className="text-center py-4">
                        <p className="text-purple-300 text-sm">
                          Complete more interviews to see trends
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Improvement Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsProgress && skillsProgress.length > 0 ? (
                    skillsProgress
                      .filter((skill) => skill.improvement > 0)
                      .slice(0, 3)
                      .map((skill, index) => (
                        <div
                          key={index}
                          className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                        >
                          <p className="text-white font-medium">
                            {skill.skill}
                          </p>
                          <p className="text-sm text-cyan-300">
                            +{skill.improvement}% improvement this month
                          </p>
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <p className="text-white font-medium">
                          Communication Skills
                        </p>
                        <p className="text-sm text-cyan-300">
                          Complete interviews to track improvement
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <p className="text-white font-medium">
                          Technical Depth
                        </p>
                        <p className="text-sm text-purple-300">
                          Complete interviews to track improvement
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <p className="text-white font-medium">
                          Problem Solving
                        </p>
                        <p className="text-sm text-emerald-300">
                          Complete interviews to track improvement
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
