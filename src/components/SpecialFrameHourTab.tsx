import { useLanguage } from "@/hooks/useLanguage";
import getTextWithLanguage from "@/helpers/language";
import SpecialFrameHourTabComponent from "./SpecialFrameHourTabComponent";

export default function SpecialFrameHourTab() {
  useLanguage();
  return (
    <div className="w-full h-full py-3 px-5 flex flex-col gap-2">
      <h1 className="text-xl font-semibold">{getTextWithLanguage({
        en: "Special Frame Hours",
        vi: "Khung giờ đặc biệt",
      })}</h1>
      <SpecialFrameHourTabComponent mode="device" />
    </div>
  );
}
