import React from "react";
import { Database, Home, Settings } from "lucide-react";
import { NavLink } from "react-router";

const Sidebar: React.FC = () => {
  const navItems = [
    { id: "", label: "Home", icon: <Home size={18} /> },
    {
      id: "device",
      label: "Device",
      icon: <Database size={18} />,
    },
    {
      id: "data-group-post",
      label: "Data group post",
      icon: <Database size={18} />,
    },
    {
      id: "special-frame-hour",
      label: "Special frame hour",
      icon: <Database size={18} />,
    },
    {
      id: "interact-before-post",
      label: "Interact before post",
      icon: <Settings size={18} />,
    },
    {
      id: "comment-post",
      label: "Comment after post",
      icon: <Settings size={18} />,
    },

    // { id: "content", label: "Post Content", icon: <FileText size={18} /> },
    // { id: "groups", label: "Manage Groups", icon: <Users size={18} /> },
    // { id: "sharing", label: "Sharing Config", icon: <Share2 size={18} /> },
    // { id: "data", label: "Data Logs", icon: <Database size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.id} className={`nav-item`} to={`/${item.id}`}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
