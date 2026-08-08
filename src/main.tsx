import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import "./App.css";
import "react-quill-new/dist/quill.snow.css";
import LayoutDefault from "./layouts/LayoutDefault.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "./components/ui/toast.tsx";
import DevicePage from "./pages/DevicePage.tsx";
import DeviceSettingPage from "./pages/DeviceSettingPage.tsx";
import DataGroupPostPage from "./pages/DataGroupPostPage.tsx";
import SpecialFrameHourPage from "./pages/SpecialFrameHourPage.tsx";
import InteractBeforePostPage from "./pages/InteractBeforePostPage.tsx";
import CommentAfterPostPage from "./pages/CommentPostPage.tsx";
// import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LayoutDefault />}>
            <Route index element={<HomePage />} />
            <Route path="/device">
              <Route index element={<DevicePage />} />
              <Route path="/device/:deviceId" element={<DeviceSettingPage />} />
            </Route>
            <Route path="/data-group-post" element={<DataGroupPostPage />} />
            <Route
              path="/special-frame-hour"
              element={<SpecialFrameHourPage />}
            />
            <Route
              path="/interact-before-post"
              element={<InteractBeforePostPage />}
            />
            <Route path="/comment-post" element={<CommentAfterPostPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
