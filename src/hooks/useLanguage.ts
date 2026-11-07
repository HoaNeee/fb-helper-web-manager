import { useSyncExternalStore } from "react";
import { KEY_LANGUAGE } from "@/constants/constants";
import { getLanguage, LANGUAGE_CHANGE_EVENT } from "@/helpers/language";

function subscribe(onChange: () => void) {
	const update = () => {
		document.documentElement.lang = getLanguage();
		onChange();
	};
	const onStorage = (event: StorageEvent) => {
		if (event.key === KEY_LANGUAGE || event.key === null) update();
	};
	window.addEventListener(LANGUAGE_CHANGE_EVENT, update);
	window.addEventListener("storage", onStorage);
	return () => {
		window.removeEventListener(LANGUAGE_CHANGE_EVENT, update);
		window.removeEventListener("storage", onStorage);
	};
}

/** Subscribe without remounting forms or discarding unsaved edits. */
export function useLanguage() {
	return useSyncExternalStore(subscribe, getLanguage, () => "en" as const);
}
