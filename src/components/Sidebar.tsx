import { useLanguage } from "@/hooks/useLanguage";
import React, { useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Database,
  Home,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { Link, NavLink, useParams } from "react-router";
import { useFeatureFlag } from "@/contexts/FeatureContext";
import getTextWithLanguage from "@/helpers/language";

const Sidebar: React.FC = () => {
  const language = useLanguage();
  const { featureFlags } = useFeatureFlag();

  const navItems = useMemo(() => {
    return [
      {
        id: "",
        label: getTextWithLanguage({ en: "Home", vi: "Trang chủ" }),
        icon: <Home size={18} />,
        locked: false,
      },
      {
        id: "device",
        label: getTextWithLanguage({
          en: "Device",
          vi: "Thiết bị",
        }),
        icon: <Database size={18} />,
        locked: false,
      },
      {
        id: "data-group-post",
        label: getTextWithLanguage({
          en: "Data group post",
          vi: "Dữ liệu bài đăng nhóm",
        }),
        icon: <Users size={18} />,
        locked: false,
      },
      {
        id: "comment-walk",
        label: getTextWithLanguage({
          en: "Comment walk",
          vi: "Bình luận dạo",
        }),
        icon: <MessageSquare size={18} />,
        locked: featureFlags.comment_walk === "locked",
      },
      {
        id: "special-frame-hour",
        label: getTextWithLanguage({
          en: "Special frame hour",
          vi: "Khung giờ đặc biệt",
        }),
        icon: <Clock size={18} />,
        locked: featureFlags.special_frame_hours === "locked",
      },
      {
        id: "interact-before-post",
        label: getTextWithLanguage({
          en: "Interact before post",
          vi: "Tương tác trước khi đăng bài",
        }),
        icon: <Settings size={18} />,
        locked: false,
      },
      {
        id: "comment-post",
        label: getTextWithLanguage({
          en: "Comment after post",
          vi: "Bình luận sau khi đăng bài",
        }),
        icon: <MessageSquare size={18} />,
        locked: false,
      },
    ];
  }, [featureFlags, language]);

  const navDeviceDetailItems = useMemo(() => {
    return [
      {
        id: "device-setting",
        label: getTextWithLanguage({ en: "Device Setting", vi: "Cài đặt thiết bị" }),
        icon: <Settings size={18} />,
        locked: false,
      },
      {
        id: "data-group-post",
        label: getTextWithLanguage({ en: "Data group post", vi: "Dữ liệu bài đăng nhóm" }),
        icon: <Users size={18} />,
        locked: false,
      },
      {
        id: "comment-walk",
        label: getTextWithLanguage({ en: "Comment walk", vi: "Bình luận dạo" }),
        icon: <MessageSquare size={18} />,
        locked: featureFlags.comment_walk === "locked",
      },
      {
        id: "scheduler",
        label: getTextWithLanguage({ en: "Scheduler", vi: "Lịch chạy" }),
        icon: <Calendar size={18} />,
        locked: false,
      },
      {
        id: "special-frame-hour",
        label: getTextWithLanguage({ en: "Special frame hour", vi: "Khung giờ đặc biệt" }),
        icon: <Clock size={18} />,
        locked: featureFlags.special_frame_hours === "locked",
      },
    ];
  }, [featureFlags, language]);

  const params = useParams();
  const deviceId = params.deviceId;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? " active" : ""}`;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {deviceId ? (
          <>
            <div className="mb-2 text-sm text-gray-500 px-2 flex gap-1">
              {getTextWithLanguage({ en: "Device:", vi: "Thiết bị:" })}{" "}
              <span className="font-semibold truncate block text-gray-600 dark:text-gray-300">
                {deviceId}
              </span>
            </div>

            <Link to={`/device`} className="nav-item">
              <ArrowLeft size={18} />
              <span>{getTextWithLanguage({
                en: "Back to device list",
                vi: "Quay lại danh sách thiết bị",
              })}</span>
            </Link>
            <div className="my-1 border-t border-gray-200 dark:border-zinc-700" />
            {navDeviceDetailItems.map((item) => {
              const isLocked = item.locked;
              if (isLocked) return null;
              return (
                <NavLink
                  key={item.id}
                  className={navClass}
                  to={`/device/${deviceId}/${item.id}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </>
        ) : (
          navItems.map((item) => {
            if (item.locked) return null;
            return (
              <NavLink
                key={item.id}
                className={navClass}
                to={`/${item.id}`}
                end={item.id === ""}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
