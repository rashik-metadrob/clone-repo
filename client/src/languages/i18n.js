import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const Languages = ['en', 'in']

i18n
    .use(
        new Backend(null, {
            loadPath: () => {
                return "/languages/{{lng}}.json";
            },
        })
    )
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        fallbackLng: "en",
        lng: "en",
        debug: false,
        whitelist: Languages, // Add white list to compile first time
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
