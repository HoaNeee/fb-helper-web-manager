import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import SpecialFrameHourTabComponent from "@/components/SpecialFrameHourTabComponent";

export default function SpecialFrameHourPage() {
  useLanguage();
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <h1 className="text-xl font-semibold">{getTextWithLanguage({
        en: "Special Frame Hours",
        vi: "Khung giờ đặc biệt",
      })}</h1>
      <SpecialFrameHourTabComponent mode="page" />
    </div>
  );
}
