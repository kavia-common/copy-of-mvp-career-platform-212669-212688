import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/Login";

import RegisterPage from "./pages/Register";
import RoleSelectionPage from "./pages/RoleSelection";
import AssessmentPage from "./pages/Assessment";
import GapAnalysisPage from "./pages/GapAnalysis";
import DevelopmentPlanPage from "./pages/DevelopmentPlan";
import AuditLogsPage from "./pages/AuditLogs";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry with router, navbar, and theme handling. */
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle the light/dark theme for the app. */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const AppContainer = useMemo(
    () => ({ paddingTop: 0, minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)" }),
    []
  );

  const RootRedirect = () => {
    const hasToken = !!localStorage.getItem("token");
    return <Navigate to={hasToken ? "/roles" : "/login"} replace />;
  };

  return (
    <div className="App" style={AppContainer}>
      <Router>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <RoleSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gap-analysis"
            element={
              <ProtectedRoute>
                <GapAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <DevelopmentPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
