import { KEY_LANGUAGE } from "@/constants/constants";
import { getValueFromStorage } from "@/utils/storage";

export default function getTextWithLanguage({
  vi,
  en,
}: {
  vi: string;
  en: string;
}) {
  const lang = getValueFromStorage(KEY_LANGUAGE, "en");
  if (lang === "vi") return vi;
  return en;
}
