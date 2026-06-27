import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';

/* 
 * 🚀 Code Splitting with React.lazy
 * We lazy load all pages so that the browser only downloads the JavaScript 
 * for the page the user is currently viewing. This drastically improves the 
 * initial load time (Time to Interactive) of the application.
 */
const Home = lazy(() => import('../pages/LandingPage.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/Signup.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const CreatePoll = lazy(() => import('../pages/CreatePoll.jsx'));
const MyPolls = lazy(() => import('../pages/MyPolls.jsx'));
const ViewPoll = lazy(() => import('../pages/ViewPoll.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));
const PublicResults = lazy(() => import('../pages/PublicResults.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

/**
 * Clean fallback loader displayed while the lazy-loaded chunk is being downloaded.
 * Uses our global CSS variables to match the primary brand color.
 */
const LoaderFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--bg-background))]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary))]"></div>
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
            (Protected via ProtectedRoute)
            ============================== */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/polls" element={<ProtectedRoute><MyPolls /></ProtectedRoute>} />
        <Route path="/polls/create" element={<ProtectedRoute><CreatePoll /></ProtectedRoute>} />
        <Route path="/analytics/:pollId" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

        {/* ==============================
            Catch-all 404 Route 
            ============================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
