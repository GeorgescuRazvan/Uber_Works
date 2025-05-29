
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import MapView from "@/components/map/MapView";
import TaskDetails from "@/components/task/TaskDetails";
import Profile from "@/components/profile/Profile";
import Support from "@/components/support/Support";
import Navigation from "@/components/layout/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskHub</h1>
            <p className="text-gray-600">Community help at your fingertips</p>
          </div>
          
          {showRegister ? (
            <RegisterForm onToggleMode={() => setShowRegister(false)} />
          ) : (
            <LoginForm onToggleMode={() => setShowRegister(true)} />
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/task/:id" element={<TaskDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
      <Toaster />
    </div>
  );
};

export default Index;
