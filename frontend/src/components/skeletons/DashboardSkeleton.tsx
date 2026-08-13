import React from 'react';

// ─── Reusable Skeleton Block ───────────────────────────────────────────────
const SkeletonBox = ({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`skeleton-pulse rounded-xl bg-muted ${className}`}
    style={style}
  />
);

// ─── Header Skeleton ───────────────────────────────────────────────────────
export const HeaderSkeleton = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-14">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <SkeletonBox className="w-9 h-9 rounded-xl" />
          <SkeletonBox className="w-24 h-5" />
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-3">
          <SkeletonBox className="w-9 h-9 rounded-xl" />
          <SkeletonBox className="w-28 h-8 rounded-full" />
        </div>
      </div>
    </div>
  </header>
);

// ─── Hero Panel Skeleton ───────────────────────────────────────────────────
const HeroPanelSkeleton = () => (
  <div className="relative p-6 sm:p-8 rounded-3xl border border-border/60 overflow-hidden glass-card">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-3">
        <SkeletonBox className="w-36 h-5 rounded-full" />
        <SkeletonBox className="w-72 h-10" />
        <SkeletonBox className="w-80 h-5" />
      </div>
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-border/60 bg-background/80">
        <SkeletonBox className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBox className="w-32 h-3" />
          <SkeletonBox className="w-40 h-4" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Module Card Skeleton ──────────────────────────────────────────────────
const ModuleCardSkeleton = () => (
  <div className="glass-card border border-border/60 rounded-3xl p-2">
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <SkeletonBox className="w-14 h-14 rounded-2xl flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonBox className="w-48 h-6" />
            <SkeletonBox className="w-full h-4" />
            <SkeletonBox className="w-3/4 h-4" />
          </div>
        </div>
        <SkeletonBox className="w-10 h-10 rounded-full self-end sm:self-center flex-shrink-0" />
      </div>
    </div>
    <div className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
      {[1, 2, 3].map((i) => (
        <SkeletonBox key={i} className="w-20 h-6 rounded-lg" />
      ))}
    </div>
  </div>
);

// ─── Sidebar Card Skeleton ─────────────────────────────────────────────────
const SidebarCardSkeleton = () => (
  <div className="glass-card border border-border/60 rounded-3xl p-6 space-y-4">
    <div className="flex items-center space-x-3">
      <SkeletonBox className="w-10 h-10 rounded-xl" />
      <div className="space-y-1.5">
        <SkeletonBox className="w-36 h-4" />
        <SkeletonBox className="w-28 h-3" />
      </div>
    </div>
    <SkeletonBox className="w-full h-12 rounded-xl" />
    <SkeletonBox className="w-full h-9 rounded-xl" />
  </div>
);

// ─── Full Dashboard Skeleton ───────────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
      {/* Hero */}
      <HeroPanelSkeleton />

      {/* Modules + Sidebar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main col */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-9 h-9 rounded-xl" />
            <SkeletonBox className="w-44 h-6" />
          </div>
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
          {/* Banner */}
          <div className="glass-card border border-border/60 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <SkeletonBox className="w-12 h-12 rounded-2xl" />
                <div className="space-y-2">
                  <SkeletonBox className="w-52 h-5" />
                  <SkeletonBox className="w-72 h-4" />
                </div>
              </div>
              <SkeletonBox className="w-36 h-10 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Sidebar col */}
        <div className="lg:col-span-4 space-y-6">
          <SidebarCardSkeleton />
          <SidebarCardSkeleton />
        </div>
      </div>
    </main>
  </div>
);

export default DashboardSkeleton;
