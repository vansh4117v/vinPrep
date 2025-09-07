"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RefreshDashboard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
    >
      <RefreshCw
        className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`}
      />
      {isPending ? "Refreshing..." : "Refresh"}
    </Button>
  );
}
