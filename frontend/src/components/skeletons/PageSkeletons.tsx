import React from 'react';
import { HeaderSkeleton } from './DashboardSkeleton';

// ─── Reusable Skeleton Block ───────────────────────────────────────────────
export const SkeletonBox = ({
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

// ─── Generic List-Page Skeleton (e.g. Leaderboard, Reports, etc.) ──────────
export const ListPageSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      {/* Page title area */}
      <div className="space-y-2">
        <SkeletonBox className="w-48 h-8" />
        <SkeletonBox className="w-72 h-4" />
      </div>
      {/* Cards list */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="glass-card border border-border/60 rounded-2xl p-5 flex items-center gap-4"
        >
          <SkeletonBox className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="w-1/3 h-5" />
            <SkeletonBox className="w-2/3 h-4" />
          </div>
          <SkeletonBox className="w-20 h-8 rounded-xl" />
        </div>
      ))}
    </main>
  </div>
);

// ─── Content-Page Skeleton (e.g. Passage, Essay, Vocabulary) ──────────────
export const ContentPageSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      <SkeletonBox className="w-16 h-8 rounded-xl" />
      <div className="space-y-3">
        <SkeletonBox className="w-3/4 h-9" />
        <SkeletonBox className="w-1/2 h-5" />
      </div>
      <div className="glass-card border border-border/60 rounded-3xl p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} className={`h-4 ${i === 3 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
      <div className="glass-card border border-border/60 rounded-3xl p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} className={`h-4 ${i === 3 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>
      <SkeletonBox className="w-full h-32 rounded-2xl" />
      <SkeletonBox className="w-32 h-10 rounded-xl" />
    </main>
  </div>
);

// ─── Profile Skeleton ──────────────────────────────────────────────────────
export const ProfileSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      {/* Profile hero */}
      <div className="glass-card border border-border/60 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <SkeletonBox className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <SkeletonBox className="w-40 h-7" />
          <SkeletonBox className="w-56 h-4" />
          <div className="flex gap-4 pt-1">
            {[1, 2, 3].map((i) => (
              <SkeletonBox key={i} className="w-20 h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      {/* Settings cards */}
      {[1, 2].map((i) => (
        <div key={i} className="glass-card border border-border/60 rounded-3xl p-6 space-y-4">
          <SkeletonBox className="w-36 h-6" />
          <SkeletonBox className="w-full h-10 rounded-xl" />
          <SkeletonBox className="w-full h-10 rounded-xl" />
          <SkeletonBox className="w-28 h-10 rounded-xl" />
        </div>
      ))}
    </main>
  </div>
);

// ─── Leaderboard Skeleton ──────────────────────────────────────────────────
export const LeaderboardSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      <div className="space-y-2">
        <SkeletonBox className="w-52 h-9" />
        <SkeletonBox className="w-72 h-4" />
      </div>
      {/* Top 3 podium */}
      <div className="flex justify-center items-end gap-4 py-4">
        <SkeletonBox className="w-24 h-28 rounded-3xl" />
        <SkeletonBox className="w-24 h-36 rounded-3xl" />
        <SkeletonBox className="w-24 h-24 rounded-3xl" />
      </div>
      {/* List */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="glass-card border border-border/60 rounded-2xl p-4 flex items-center gap-4"
        >
          <SkeletonBox className="w-8 h-8 rounded-full flex-shrink-0" />
          <SkeletonBox className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBox className="w-1/3 h-4" />
            <SkeletonBox className="w-1/4 h-3" />
          </div>
          <SkeletonBox className="w-16 h-6 rounded-full" />
        </div>
      ))}
    </main>
  </div>
);

// ─── Test / Quiz Skeleton ──────────────────────────────────────────────────
export const TestPageSkeleton = () => (
  <div className="relative min-h-screen bg-background flex flex-col">
    <HeaderSkeleton />
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
      {/* Progress bar */}
      <SkeletonBox className="w-full h-3 rounded-full" />
      <div className="glass-card border border-border/60 rounded-3xl p-8 space-y-6">
        <SkeletonBox className="w-16 h-5 rounded-full" />
        <SkeletonBox className="w-full h-7" />
        <SkeletonBox className="w-4/5 h-7" />
        {/* Options */}
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} className="w-full h-14 rounded-2xl" />
        ))}
      </div>
      <div className="flex justify-between">
        <SkeletonBox className="w-28 h-10 rounded-xl" />
        <SkeletonBox className="w-28 h-10 rounded-xl" />
      </div>
    </main>
  </div>
);

export default ListPageSkeleton;
