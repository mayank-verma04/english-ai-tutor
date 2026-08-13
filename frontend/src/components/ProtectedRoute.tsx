import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import {
  ListPageSkeleton,
  LeaderboardSkeleton,
  TestPageSkeleton,
  ProfileSkeleton,
  ContentPageSkeleton,
} from '@/components/skeletons/PageSkeletons';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Returns the appropriate full-page skeleton based on the current URL path
 * so the layout exactly matches the real page that will render.
 */
const getSkeletonForPath = (pathname: string) => {
  if (pathname === '/dashboard') return <DashboardSkeleton />;
  if (pathname === '/leaderboard') return <LeaderboardSkeleton />;
  if (pathname === '/on-demand-test') return <TestPageSkeleton />;
  if (pathname === '/profile') return <ProfileSkeleton />;
  if (
    pathname.startsWith('/report') ||
    pathname.startsWith('/letters') ||
    pathname.startsWith('/essays') ||
    pathname.startsWith('/passages') ||
    pathname.startsWith('/short-paragraphs') ||
    pathname.startsWith('/persuasive-writing')
  ) {
    return <ListPageSkeleton />;
  }
  // Default — generic content page skeleton
  return <ContentPageSkeleton />;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return getSkeletonForPath(location.pathname);
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;