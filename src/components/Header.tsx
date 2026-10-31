import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage, { setLanguage } from "@/helpers/language";
import React, { useState } from "react";
import { Moon, Sun, User } from "lucide-react";
import { Button } from "./Button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DialogConfirm from "./dialogs/DialogConfirm";
import DialogEditProfile from "./dialogs/DialogEditProfile";
import { Link } from "react-router";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const language = useLanguage();
  const { state: authState, logout } = useAuth();

  const [openDialogConfirmLogout, setOpenDialogConfirmLogout] = useState(false);
  const [openDialogEditProfile, setOpenDialogEditProfile] = useState(false);

  function renderAuthenticated() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className={"cursor-pointer"}>
            <AvatarImage
              src={authState.user?.avatar}
              alt={authState.user?.username || ""}
            />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className={"font-normal"}>
              {authState.user?.username ||
                getTextWithLanguage({
                  en: "My account",
                  vi: "Tài khoản của tôi",
                })}
            </DropdownMenuLabel>
            <DropdownMenuItem
              className={"cursor-pointer"}
              onClick={() => setOpenDialogEditProfile(true)}
            >
              {getTextWithLanguage({ en: "My Profile", vi: "Hồ sơ của tôi" })}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={"cursor-pointer"}
              variant="destructive"
              onClick={() => setOpenDialogConfirmLogout(true)}
            >
              {getTextWithLanguage({ en: "Logout", vi: "Đăng xuất" })}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <header className="header">
        <Link to={"/"} className="header-left">
          <div className="logo-placeholder">FB</div>
          <span className="app-title">FB Helper Web Manager</span>
        </Link>
        <div className="header-right">
          <button
            className="icon-button"
            onClick={toggleTheme}
            title={
              isDarkMode
                ? getTextWithLanguage({
                    en: "Switch to Light Mode",
                    vi: "Chuyển sang giao diện sáng",
                  })
                : getTextWithLanguage({
                    en: "Switch to Dark Mode",
                    vi: "Chuyển sang giao diện tối",
                  })
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value === "vi" ? "vi" : "en")
            }
            aria-label={getTextWithLanguage({ en: "Language", vi: "Ngôn ngữ" })}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              outline: "none",
              fontSize: "14px",
              padding: "4px",
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
              <Button
                text={getTextWithLanguage({
                  en: "Login",
                  vi: "Đăng nhập",
                })}
                size="sm"
                className="text-sm"
              />
            )}
          </div>
        </div>
      </header>
      {openDialogEditProfile && authState.user && (
        <DialogEditProfile
          user={authState.user}
          open={openDialogEditProfile}
          onOpenChange={setOpenDialogEditProfile}
        />
      )}
      <DialogConfirm
        open={openDialogConfirmLogout}
        onOpenChange={setOpenDialogConfirmLogout}
        title={getTextWithLanguage({ en: "Logout", vi: "Đăng xuất" })}
        description={getTextWithLanguage({
          en: "Are you sure you want to logout?",
          vi: "Bạn có chắc muốn đăng xuất?",
        })}
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
