import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Overview from "./pages/Overview";
import BrandDashboard from "./pages/BrandDashboard";

import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Executive Overview */}
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />

        {/* Brand Dashboard */}
        <Route
          path="/brand/:brandCode"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        {/* Placeholder Pages */}
        <Route
          path="/brand/:brandCode/pnl"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/:brandCode/delivery"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/:brandCode/reviews"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/brand/:brandCode/pipeline"
          element={
            <ProtectedRoute>
              <BrandDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;