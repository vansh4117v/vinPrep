"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { getUserStats, migrateUserStats } from "@/lib/actions/user-stats.action";

interface UserStatsProps {
  userId: string;
  className?: string;
}

interface UserStats {
  interviewCount: number;
  questionCount: number;
}

const UserStatsCard = ({ userId, className = "" }: UserStatsProps) => {
  const [stats, setStats] = useState<UserStats>({ interviewCount: 0, questionCount: 0 });
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStats = await getUserStats(userId);
      
      if (userStats) {
        setStats(userStats);
      } else {
        setError("Failed to load user statistics");
      }
    } catch (err) {
      console.error("Error fetching user stats:", err);
      setError("Failed to load user statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleMigrate = async () => {
    try {
      setMigrating(true);
      setError(null);
      const result = await migrateUserStats(userId);
      
      if (result.success) {
        // Refresh stats after migration
        await fetchStats();
      } else {
        setError(result.error || "Failed to migrate user statistics");
      }
    } catch (err) {
      console.error("Error migrating user stats:", err);
      setError("Failed to migrate user statistics");
    } finally {
      setMigrating(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card className={`bg-slate-800/50 border-purple-500/30 backdrop-blur-sm ${className}`}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <span className="ml-2 text-purple-200">Loading statistics...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-slate-800/50 border-red-500/30 backdrop-blur-sm ${className}`}>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-red-200 text-center">{error}</p>
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            className="border-red-400 text-red-300 hover:bg-red-500/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">
              Total Interviews
            </CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.interviewCount}
            </div>
            <p className="text-xs text-purple-300 mt-1">
              Interviews completed
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge 
                variant="outline" 
                className="border-purple-400 text-purple-300"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-200">
              Questions Asked
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.questionCount}
            </div>
            <p className="text-xs text-cyan-300 mt-1">
              Questions practiced
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Badge 
                variant="outline" 
                className="border-cyan-400 text-cyan-300"
              >
                Practice
              </Badge>
              {stats.interviewCount > 0 && (
                <span className="text-xs text-cyan-400">
                  {Math.round(stats.questionCount / stats.interviewCount)} avg per interview
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Migration Notice for Existing Users */}
      {stats.interviewCount === 0 && stats.questionCount === 0 && (
        <Card className="bg-slate-800/50 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-yellow-200 text-sm">
              Existing User Migration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-yellow-300 text-sm">
              If you're an existing user with interview history, click below to calculate 
              your statistics from your previous interviews.
            </p>
            <Button
              onClick={handleMigrate}
              disabled={migrating}
              size="sm"
              className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/30"
            >
              {migrating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Calculate My Stats
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          onClick={fetchStats}
          variant="ghost"
          size="sm"
          className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Stats
        </Button>
      </div>
    </div>
  );
};

export default UserStatsCard;
