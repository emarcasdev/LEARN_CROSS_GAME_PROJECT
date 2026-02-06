import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./en.json";
import es from "./es.json";

const deviceLang = (Localization.getLocales()?.[0]?.languageCode ?? "es").toLowerCase();
const initialLang = ["es", "en"].includes(deviceLang) ? deviceLang : "es";

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        resources: {
            es: {translation: es},
            en: {translation: en},
        },
        lng: initialLang,
        fallbackLng: "es",
        interpolation: {
            escapeValue: false,
        },
    });
}

export default i18n;