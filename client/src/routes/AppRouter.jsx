import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

/* 
 * 🚀 Code Splitting with React.lazy
 */
const Home = lazy(() => import('../pages/LandingPage.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/SignupPage.jsx'));
const ForgotPassword = lazy(() => import('../pages/ForgotPasswordPage.jsx'));
const ResetPassword = lazy(() => import('../pages/ResetPasswordPage.jsx'));

// Dashboard & Layout
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout.jsx'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx'));
const SettingsPage = lazy(() => import('../pages/SettingsPage.jsx'));

const CreatePoll = lazy(() => import('../pages/CreatePollPage.jsx'));
const MyPolls = lazy(() => import('../pages/MyPollsPage.jsx'));
const ManageEvents = lazy(() => import('../pages/ManageEventsPage.jsx'));
const CreateEvent = lazy(() => import('../pages/CreateEventPage.jsx'));
const PublicEvent = lazy(() => import('../pages/PublicEventPage.jsx'));
const EventAnalytics = lazy(() => import('../pages/EventAnalyticsPage.jsx'));
const EventParticipants = lazy(() => import('../pages/EventParticipantsPage.jsx'));
const ViewPoll = lazy(() => import('../pages/PublicPollPage.jsx'));
const PollSubmitted = lazy(() => import('../pages/PollSubmittedPage.jsx'));
const Analytics = lazy(() => import('../pages/AnalyticsPage.jsx'));
const PublicResults = lazy(() => import('../pages/PublishedResultsPage.jsx'));
const LiveEventPage = lazy(() => import('../pages/LiveEventPage.jsx'));
const PollLobbyPage = lazy(() => import('../pages/PollLobbyPage.jsx'));
const LeaderboardPage = lazy(() => import('../pages/LeaderboardPage.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

/**
 * Clean fallback loader displayed while the lazy-loaded chunk is being downloaded.
 */
const LoaderFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--bg-background))]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoaderFallback />}>
      <Routes>
        {/* ==============================
            Public / Authentication Routes 
            ============================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* ==============================
            Poll & Event Participation Routes 
            {/* Public Respondent Routes */}
        <Route path="/poll/:pollId" element={
          <ErrorBoundary>
            <ViewPoll />
          </ErrorBoundary>
        } />
        <Route path="/poll/:pollId/success" element={<PollSubmitted />} />
        <Route path="/results/:pollId" element={<PublicResults />} />
        <Route path="/event/:slug" element={<PublicEvent />} />
        <Route path="/live/:pollId" element={<LiveEventPage />} />

        {/* ==============================
            Presenter / Fullscreen Routes 
            (Protected via ProtectedRoute but NO Dashboard Layout)
            ============================== */}
        <Route path="/poll/:pollId/lobby" element={<ProtectedRoute><PollLobbyPage /></ProtectedRoute>} />
        <Route path="/poll/:pollId/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

        {/* ==============================
            Creator Dashboard Routes 
            (Protected via ProtectedRoute and DashboardLayout)
            ============================== */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Outlet routes injected into DashboardLayout */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/polls" element={<MyPolls />} />
          <Route path="/events" element={<ManageEvents />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id/edit" element={<CreateEvent />} />
          <Route path="/events/:id/participants" element={<EventParticipants />} />
          <Route path="/events/analytics/dashboard" element={<EventAnalytics />} />
          <Route path="/polls/create" element={<CreatePoll />} />
          <Route path="/polls/:id/edit" element={<CreatePoll />} />
          <Route path="/analytics/:pollId" element={<Analytics />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* ==============================
            Catch-all 404 Route 
            ============================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
