import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import LayoutDefault from "../layouts/LayoutDefault";
import DataGroupPostPage from "../pages/DataGroupPostPage";
import DevicePage from "../pages/DevicePage";
import UserSettingPage from "../pages/UserSettingPage";
import DeviceSettingPage from "../pages/DeviceSettingPage";
import SpecialFrameHourPage from "@/pages/SpecialFrameHourPage";
import CommentAfterPostPage from "@/pages/CommentPostPage";
import InteractBeforePostPage from "@/pages/InteractBeforePostPage";
import RegisterPage from "@/pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "data-group-post",
        element: <DataGroupPostPage />,
      },
      {
        path: "special-frame-hour",
        element: <SpecialFrameHourPage />,
      },
      {
        path: "device",
        children: [
          {
            index: true,
            element: <DevicePage />,
          },
          {
            path: ":deviceId",
            element: <DeviceSettingPage />,
          },
        ],
      },
      {
        path: "interact-before-post",
        element: <InteractBeforePostPage />,
      },
      {
        path: "comment-post",
        element: <CommentAfterPostPage />,
      },
      {
        path: "setting",
        element: <UserSettingPage />,
      },
    ],
  },
]);

export default router;
