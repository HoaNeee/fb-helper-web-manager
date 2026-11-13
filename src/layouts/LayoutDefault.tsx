import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

export default function LayoutDefault() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { state: authState } = useAuth();

  useEffect(() => {
    if (authState.loading) return;
    if (!authState.is_authenticated) {
      location.href = "/login";
    }
  }, [authState.is_authenticated, authState.loading]);

  // Handle Theme Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!authState.is_authenticated || authState.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading type="dialog" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
