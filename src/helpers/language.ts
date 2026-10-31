import { KEY_LANGUAGE } from "@/constants/constants";
import { getValueFromStorage, setValueToStorage } from "@/utils/storage";

export type Language = "vi" | "en";
export const LANGUAGE_CHANGE_EVENT = "app:language-change";

export function getLanguage(): Language {
  try {
    return getValueFromStorage(KEY_LANGUAGE, "en") === "vi" ? "vi" : "en";
  } catch {
    return "en";
  }
}

export function setLanguage(language: Language) {
  setValueToStorage(KEY_LANGUAGE, language);
  document.documentElement.lang = language;
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

export default function getTextWithLanguage({
  vi,
  en,
}: {
  vi: string;
  en: string;
}) {
  const lang = getLanguage();
  if (lang === "vi") return vi;
  return en;
}
