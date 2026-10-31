import React, { Suspense, lazy, useEffect } from 'react';
import { RouteSkeleton } from '@/components/organisms/RouteSkeleton';
import { dismissSplash } from '@/lib/splash';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AssessmentProvider } from '@/context/AssessmentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Lazy-loaded Pages for code-splitting & chunk size optimization
const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const ModulaProjectPage = lazy(() => import('@/pages/ModulaProjectPage').then((m) => ({ default: m.ModulaProjectPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const NewAssessmentPage = lazy(() => import('@/pages/NewAssessmentPage').then((m) => ({ default: m.NewAssessmentPage })));
const AssessmentOverviewPage = lazy(() => import('@/pages/AssessmentOverviewPage').then((m) => ({ default: m.AssessmentOverviewPage })));
const AssessmentBuilderPage = lazy(() => import('@/pages/AssessmentBuilderPage').then((m) => ({ default: m.AssessmentBuilderPage })));
const AssessmentStatsPage = lazy(() => import('@/pages/AssessmentStatsPage').then((m) => ({ default: m.AssessmentStatsPage })));
const AssessmentSettingsPage = lazy(() => import('@/pages/AssessmentSettingsPage').then((m) => ({ default: m.AssessmentSettingsPage })));
const HostLiveLobbyPage = lazy(() => import('@/pages/HostLiveLobbyPage').then((m) => ({ default: m.HostLiveLobbyPage })));
const ParticipantLobbyPage = lazy(() => import('@/pages/ParticipantLobbyPage').then((m) => ({ default: m.ParticipantLobbyPage })));
const ParticipantPlayPage = lazy(() => import('@/pages/ParticipantPlayPage').then((m) => ({ default: m.ParticipantPlayPage })));
const ParticipantResultPage = lazy(() => import('@/pages/ParticipantResultPage').then((m) => ({ default: m.ParticipantResultPage })));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Suspends with the routes, so the splash leaves only once the first page can paint.
const SplashDismiss: React.FC = () => {
  useEffect(dismissSplash, []);
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AssessmentProvider>
            <BrowserRouter>
              <Suspense fallback={<RouteSkeleton />}>
                <SplashDismiss />
                <Routes>
                  {/* Public Root Route */}
                  <Route path="/" element={<LandingPage />} />

                  {/* Public Authentication Shell */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* Public Modula Project Registry (Discoverable via footer) */}
                  <Route path="/modula-project" element={<ModulaProjectPage />} />

                  {/* Protected Application Workspace Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/new" element={<NewAssessmentPage />} />
                    <Route path="/dashboard/:assessmentId" element={<AssessmentOverviewPage />} />
                    <Route path="/dashboard/:assessmentId/builder" element={<AssessmentBuilderPage />} />
                    <Route path="/dashboard/:assessmentId/live" element={<HostLiveLobbyPage />} />
                    <Route path="/dashboard/:assessmentId/stats" element={<AssessmentStatsPage />} />
                    <Route path="/dashboard/:assessmentId/settings" element={<AssessmentSettingsPage />} />
                  </Route>

                  {/* Public Leaderboard Route */}
                  <Route path="/leaderboard/:slug" element={<LeaderboardPage />} />

                  {/* Public Participant Play Experience Routes */}
                  <Route path="/:slug" element={<ParticipantLobbyPage />} />
                  <Route path="/:slug/start" element={<ParticipantLobbyPage />} />
                  <Route path="/:slug/question/:questionNumber" element={<ParticipantPlayPage />} />
                  <Route path="/:slug/result" element={<ParticipantResultPage />} />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AssessmentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
