"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-96 bg-slate-700" />
            <Skeleton className="h-5 w-64 bg-slate-700" />
          </div>
          <Skeleton className="h-10 w-48 bg-slate-700" />
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-slate-600" />
                <Skeleton className="h-4 w-4 bg-slate-600 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-slate-600 mb-2" />
                <Skeleton className="h-3 w-20 bg-slate-600" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-full bg-slate-700" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-slate-600" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-slate-600" />
                ))}
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-slate-600" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full bg-slate-600" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
