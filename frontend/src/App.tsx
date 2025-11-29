import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import OnDemandTestPage from "./pages/OnDemandTestPage";
import ComprehensionModule from "./pages/ComprehensionModule";
import CompositionModule from "./pages/CompositionModule";
import Vocabulary from "./pages/Vocabulary";
import Sentence from "./pages/Sentence";
import PassageList from "./pages/PassageList";
import Passage from "./pages/Passage";
import SentenceFormation from "./pages/SentenceFormation";
import ShortParagraphs from "./pages/ShortParagraphs";
import ShortParagraph from "./pages/ShortParagraph";
import TonePractice from "./pages/TonePractice";
import TonePracticeDetail from "./pages/TonePracticeDetail";
import Letters from "./pages/Letters";
import Letter from "./pages/Letter";
import Essays from "./pages/Essays";
import Essay from "./pages/Essay";
import Reports from "./pages/Reports";
import Report from "./pages/Report";
import PersuasiveWriting from "./pages/PersuasiveWriting";
import PersuasiveWritingDetail from "./pages/PersuasiveWritingDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/on-demand-test" element={
              <ProtectedRoute>
                <OnDemandTestPage />
              </ProtectedRoute>
            } />
            <Route path="/comprehension" element={
              <ProtectedRoute>
                <ComprehensionModule />
              </ProtectedRoute>
            } />
            <Route path="/composition" element={
              <ProtectedRoute>
                <CompositionModule />
              </ProtectedRoute>
            } />
            <Route path="/vocabulary" element={
              <ProtectedRoute>
                <Vocabulary />
              </ProtectedRoute>
            } />
            <Route path="/sentence" element={
              <ProtectedRoute>
                <Sentence />
              </ProtectedRoute>
            } />
            <Route path="/passages" element={
              <ProtectedRoute>
                <PassageList />
              </ProtectedRoute>
            } />
            <Route path="/passage" element={
              <ProtectedRoute>
                <Passage />
              </ProtectedRoute>
            } />
            <Route path="/sentence-formation" element={
              <ProtectedRoute>
                <SentenceFormation />
              </ProtectedRoute>
            } />
            <Route path="/short-paragraphs" element={
              <ProtectedRoute>
                <ShortParagraphs />
              </ProtectedRoute>
            } />
            <Route path="/short-paragraph" element={
              <ProtectedRoute>
                <ShortParagraph />
              </ProtectedRoute>
            } />
            <Route path="/tone-practice" element={
              <ProtectedRoute>
                <TonePractice />
              </ProtectedRoute>
            } />
            <Route path="/tone-practice-detail" element={
              <ProtectedRoute>
                <TonePracticeDetail />
              </ProtectedRoute>
            } />
            <Route path="/letters" element={
              <ProtectedRoute>
                <Letters />
              </ProtectedRoute>
            } />
            <Route path="/letter" element={
              <ProtectedRoute>
                <Letter />
              </ProtectedRoute>
            } />
            <Route path="/essays" element={
              <ProtectedRoute>
                <Essays />
              </ProtectedRoute>
            } />
            <Route path="/essay" element={
              <ProtectedRoute>
                <Essay />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />
            <Route path="/persuasive-writing" element={
              <ProtectedRoute>
                <PersuasiveWriting />
              </ProtectedRoute>
            } />
            <Route path="/persuasive-writing-detail" element={
              <ProtectedRoute>
                <PersuasiveWritingDetail />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
