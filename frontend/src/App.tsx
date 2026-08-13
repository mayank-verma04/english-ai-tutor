import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ── Skeleton fallbacks ──────────────────────────────────────────────────────
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import {
  ListPageSkeleton,
  ContentPageSkeleton,
  LeaderboardSkeleton,
  TestPageSkeleton,
  ProfileSkeleton,
} from "@/components/skeletons/PageSkeletons";

// ── Lazy-loaded pages ───────────────────────────────────────────────────────
// Public
const Index       = lazy(() => import("./pages/Index"));
const Login       = lazy(() => import("./pages/Login"));
const Register    = lazy(() => import("./pages/Register"));
const PrivacyPolicy    = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService   = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy     = lazy(() => import("./pages/CookiePolicy"));
const NotFound         = lazy(() => import("./pages/NotFound"));

// Protected — main
const Dashboard   = lazy(() => import("./pages/Dashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const OnDemandTestPage = lazy(() => import("./pages/OnDemandTestPage"));
const Profile     = lazy(() => import("./pages/Profile"));

// Modules
const ComprehensionModule = lazy(() => import("./pages/ComprehensionModule"));
const CompositionModule   = lazy(() => import("./pages/CompositionModule"));

// Lessons
const Vocabulary         = lazy(() => import("./pages/Vocabulary"));
const Sentence           = lazy(() => import("./pages/Sentence"));
const PassageList        = lazy(() => import("./pages/PassageList"));
const Passage            = lazy(() => import("./pages/Passage"));
const SentenceFormation  = lazy(() => import("./pages/SentenceFormation"));
const ShortParagraphs    = lazy(() => import("./pages/ShortParagraphs"));
const ShortParagraph     = lazy(() => import("./pages/ShortParagraph"));
const TonePractice       = lazy(() => import("./pages/TonePractice"));
const TonePracticeDetail = lazy(() => import("./pages/TonePracticeDetail"));
const Letters            = lazy(() => import("./pages/Letters"));
const Letter             = lazy(() => import("./pages/Letter"));
const Essays             = lazy(() => import("./pages/Essays"));
const Essay              = lazy(() => import("./pages/Essay"));
const Reports            = lazy(() => import("./pages/Reports"));
const Report             = lazy(() => import("./pages/Report"));
const PersuasiveWriting       = lazy(() => import("./pages/PersuasiveWriting"));
const PersuasiveWritingDetail = lazy(() => import("./pages/PersuasiveWritingDetail"));

// ── Query Client ────────────────────────────────────────────────────────────
const queryClient = new QueryClient();

// ── Suspense wrappers with matching skeletons ───────────────────────────────
const WithDashboard   = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
);
const WithLeaderboard = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LeaderboardSkeleton />}>{children}</Suspense>
);
const WithTest        = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<TestPageSkeleton />}>{children}</Suspense>
);
const WithProfile     = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ProfileSkeleton />}>{children}</Suspense>
);
const WithList        = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ListPageSkeleton />}>{children}</Suspense>
);
const WithContent     = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ContentPageSkeleton />}>{children}</Suspense>
);
// Public pages can use a minimal blank fallback (they load almost instantly)
const WithPublic      = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>
);

// ── App ─────────────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ── Public Routes ─────────────────────────────────────── */}
                <Route path="/" element={<WithPublic><Index /></WithPublic>} />
                <Route path="/login"    element={<WithPublic><Login /></WithPublic>} />
                <Route path="/register" element={<WithPublic><Register /></WithPublic>} />
                <Route path="/privacy-policy"   element={<WithPublic><PrivacyPolicy /></WithPublic>} />
                <Route path="/terms-of-service" element={<WithPublic><TermsOfService /></WithPublic>} />
                <Route path="/cookie-policy"    element={<WithPublic><CookiePolicy /></WithPublic>} />

                {/* ── Protected — Main ──────────────────────────────────── */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <WithDashboard><Dashboard /></WithDashboard>
                  </ProtectedRoute>
                } />
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <WithLeaderboard><Leaderboard /></WithLeaderboard>
                  </ProtectedRoute>
                } />
                <Route path="/on-demand-test" element={
                  <ProtectedRoute>
                    <WithTest><OnDemandTestPage /></WithTest>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <WithProfile><Profile /></WithProfile>
                  </ProtectedRoute>
                } />

                {/* ── Module Routes ─────────────────────────────────────── */}
                <Route path="/comprehension" element={<ProtectedRoute><WithContent><ComprehensionModule /></WithContent></ProtectedRoute>} />
                <Route path="/composition"   element={<ProtectedRoute><WithContent><CompositionModule /></WithContent></ProtectedRoute>} />

                {/* ── Lesson Routes ─────────────────────────────────────── */}
                <Route path="/vocabulary"   element={<ProtectedRoute><WithContent><Vocabulary /></WithContent></ProtectedRoute>} />
                <Route path="/sentence"     element={<ProtectedRoute><WithContent><Sentence /></WithContent></ProtectedRoute>} />
                <Route path="/passages"     element={<ProtectedRoute><WithList><PassageList /></WithList></ProtectedRoute>} />
                <Route path="/passage"      element={<ProtectedRoute><WithContent><Passage /></WithContent></ProtectedRoute>} />

                <Route path="/sentence-formation" element={<ProtectedRoute><WithContent><SentenceFormation /></WithContent></ProtectedRoute>} />
                <Route path="/short-paragraphs"   element={<ProtectedRoute><WithList><ShortParagraphs /></WithList></ProtectedRoute>} />
                <Route path="/short-paragraph"    element={<ProtectedRoute><WithContent><ShortParagraph /></WithContent></ProtectedRoute>} />

                <Route path="/tone-practice"        element={<ProtectedRoute><WithList><TonePractice /></WithList></ProtectedRoute>} />
                <Route path="/tone-practice-detail" element={<ProtectedRoute><WithContent><TonePracticeDetail /></WithContent></ProtectedRoute>} />

                <Route path="/letters" element={<ProtectedRoute><WithList><Letters /></WithList></ProtectedRoute>} />
                <Route path="/letter"  element={<ProtectedRoute><WithContent><Letter /></WithContent></ProtectedRoute>} />

                <Route path="/essays" element={<ProtectedRoute><WithList><Essays /></WithList></ProtectedRoute>} />
                <Route path="/essay"  element={<ProtectedRoute><WithContent><Essay /></WithContent></ProtectedRoute>} />

                <Route path="/reports" element={<ProtectedRoute><WithList><Reports /></WithList></ProtectedRoute>} />
                <Route path="/report"  element={<ProtectedRoute><WithContent><Report /></WithContent></ProtectedRoute>} />

                <Route path="/persuasive-writing"        element={<ProtectedRoute><WithList><PersuasiveWriting /></WithList></ProtectedRoute>} />
                <Route path="/persuasive-writing-detail" element={<ProtectedRoute><WithContent><PersuasiveWritingDetail /></WithContent></ProtectedRoute>} />

                {/* ── 404 ───────────────────────────────────────────────── */}
                <Route path="*" element={<WithPublic><NotFound /></WithPublic>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;