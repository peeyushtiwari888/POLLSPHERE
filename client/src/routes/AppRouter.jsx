import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';

/* 
 * 🚀 Code Splitting with React.lazy
 */
const Home = lazy(() => import('../pages/LandingPage.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/SignupPage.jsx'));

// Dashboard & Layout
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout.jsx'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));

// Other App Pages
const CreatePoll = lazy(() => import('../pages/CreatePollPage.jsx'));
const MyPolls = lazy(() => import('../pages/MyPolls.jsx'));
const ViewPoll = lazy(() => import('../pages/ViewPoll.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));
const PublicResults = lazy(() => import('../pages/PublicResults.jsx'));
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
        
        {/* ==============================
            Poll Participation Routes 
            ============================== */}
        <Route path="/poll/:pollId" element={<ViewPoll />} />
        <Route path="/results/:pollId" element={<PublicResults />} />

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
          <Route path="/polls/create" element={<CreatePoll />} />
          <Route path="/polls/:id/edit" element={<CreatePoll />} />
          <Route path="/analytics/:pollId" element={<Analytics />} />
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
