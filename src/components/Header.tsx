import React, { useState } from "react";
import { Moon, Sun, Settings, User } from "lucide-react";
import Button from "./Button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DialogConfirm from "./dialogs/DialogConfirm";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const { state: authState, logout } = useAuth();

  const [openDialogConfirmLogout, setOpenDialogConfirmLogout] = useState(false);

  function renderAuthenticated() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className={"cursor-pointer"}>
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className={"font-normal"}>
              {authState.user?.name || authState.user?.username || "My account"}
            </DropdownMenuLabel>
            <DropdownMenuItem className={"cursor-pointer"}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className={"cursor-pointer"}
              variant="destructive"
              onClick={() => setOpenDialogConfirmLogout(true)}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo-placeholder">FB</div>
          <span className="app-title">FB Helper Web Manager</span>
        </div>
        <div className="header-right">
          <button
            className="icon-button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="vi">VI</option>
            <option value="en">EN</option>
          </select>
          <div>
            {/* <Button text="Login" size="sm" className="text-sm" /> */}
            {authState.is_authenticated ? (
              renderAuthenticated()
            ) : (
              <Button text="Login" size="sm" className="text-sm" />
            )}
          </div>
        </div>
      </header>
      <DialogConfirm
        open={openDialogConfirmLogout}
        onOpenChange={setOpenDialogConfirmLogout}
        title="Logout"
        description="Are you sure you want to logout?"
        onConfirm={() => {
          logout();
          setOpenDialogConfirmLogout(false);
        }}
        onCancel={() => {
          setOpenDialogConfirmLogout(false);
        }}
      />
    </>
  );
};

export default Header;
