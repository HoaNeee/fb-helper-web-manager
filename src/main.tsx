import { getLanguage } from "./helpers/language";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-quill-new/dist/quill.snow.css";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import CommentWalkTab from "./components/CommentWalkTab.tsx";
import DataGroupPostTab from "./components/DataGroupPostTab.tsx";
import DeviceSettingTab from "./components/DeviceSettingTab.tsx";
import SchedulerTab from "./components/SchedulerTab.tsx";
import SpecialFrameHourTab from "./components/SpecialFrameHourTab.tsx";
import { Toaster } from "./components/ui/toast.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import LayoutDefault from "./layouts/LayoutDefault.tsx";
import CommentAfterPostPage from "./pages/CommentPostPage.tsx";
import CommentWalkPage from "./pages/CommentWalkPage.tsx";
import DataGroupPostPage from "./pages/DataGroupPostPage.tsx";
import DevicePage from "./pages/DevicePage.tsx";
import HomePage from "./pages/HomePage.tsx";
import InteractBeforePostPage from "./pages/InteractBeforePostPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import SpecialFrameHourPage from "./pages/SpecialFrameHourPage.tsx";
import { FeatureProvider } from "./contexts/FeatureContext.tsx";
// import { AuthProvider } from "./contexts/AuthContext";

document.documentElement.lang = getLanguage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeatureProvider>
          <Routes>
            <Route path="/" element={<LayoutDefault />}>
              <Route index element={<HomePage />} />
              <Route path="/device">
                <Route index element={<DevicePage />} />
                <Route path="/device/:deviceId">
                  <Route path="comment-walk" element={<CommentWalkTab />} />
                  <Route path="scheduler" element={<SchedulerTab />} />
                  <Route path="device-setting" element={<DeviceSettingTab />} />
                  <Route path="scheduler" element={<SchedulerTab />} />
                  <Route
                    path="special-frame-hour"
                    element={<SpecialFrameHourTab />}
                  />
                  <Route
                    path="data-group-post"
                    element={<DataGroupPostTab />}
                  />
                </Route>
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
              <Route path="/comment-walk" element={<CommentWalkPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<>Not found</>} />
          </Routes>
        </FeatureProvider>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
