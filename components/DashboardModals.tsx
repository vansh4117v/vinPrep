"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  INTERVIEW_TYPES,
  SKILL_CATEGORIES,
  PRACTICE_SESSIONS,
} from "@/constants/dashboard";
import {
  PlayCircle,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Users,
  Zap,
} from "lucide-react";

export function StartInterviewModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30">
          <PlayCircle className="mr-2 h-4 w-4" />
          Start AI Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-purple-500/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Choose Interview Type
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {INTERVIEW_TYPES.map((type) => (
            <Card
              key={type.id}
              className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <CardTitle className="text-lg text-white">
                    {type.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 mb-4">
                  {type.description}
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500"
                >
                  <Link href={type.path}>Start Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PracticeSkillsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30">
          <Target className="mr-2 h-4 w-4" />
          Practice Specific Skills
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-cyan-500/30 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Focus on Specific Skills
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {SKILL_CATEGORIES.map((skill) => (
            <Card key={skill.id} className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  {skill.title}
                </CardTitle>
                <p className="text-sm text-slate-300">{skill.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {skill.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">{exercise}</span>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  <Link href={`/interview?skill=${skill.id}`}>
                    Practice {skill.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScheduleSessionModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Practice Session
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-orange-500/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Schedule Your Practice
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {PRACTICE_SESSIONS.map((session) => (
            <Card
              key={session.id}
              className="bg-slate-700/50 border-slate-600 hover:border-orange-500/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {session.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-orange-400 text-orange-300"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {session.duration} min
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                  {session.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {session.questionCount} questions
                  </span>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    <Link
                      href={`/interview?duration=${session.duration}&questions=${session.questionCount}`}
                    >
                      Schedule Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ViewAnalyticsModal({
  userInterviews = [],
  achievements = [],
}: {
  userInterviews: any[];
  achievements: any[];
}) {
  const completedInterviews = Array.isArray(userInterviews)
    ? userInterviews.filter((interview: any) => interview?.finalized).length
    : 0;
  const totalTime = completedInterviews * 25; // Estimate 25 minutes per interview

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Detailed Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-emerald-500/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Your Interview Analytics
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-emerald-400">
                  {userInterviews.length}
                </div>
                <p className="text-sm text-slate-300">Total Interviews</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {completedInterviews}
                </div>
                <p className="text-sm text-slate-300">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.floor(totalTime / 60)}h {totalTime % 60}m
                </div>
                <p className="text-sm text-slate-300">Practice Time</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Interviews */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Interview History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userInterviews.length > 0 ? (
                <div className="space-y-3">
                  {userInterviews
                    .slice(0, 5)
                    .map((interview: any, index: number) => (
                      <div
                        key={interview.id || index}
                        className="flex items-center justify-between p-3 bg-slate-600/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {interview.role} - {interview.type}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No interviews completed yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map((achievement: any, index: number) => (
                    <div
                      key={achievement.id || index}
                      className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="text-white font-medium">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">
                    Complete interviews to unlock achievements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
