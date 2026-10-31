import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
export default function UserSettingPage() {
  useLanguage();
  return (
    <div>
      {getTextWithLanguage({ en: "User setting", vi: "Cài đặt người dùng" })}
    </div>
  );
}
