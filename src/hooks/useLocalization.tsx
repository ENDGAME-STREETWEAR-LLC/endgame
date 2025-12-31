"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import en from "../locales/en";
import es from "../locales/es";

const LOCALES = Object.freeze({ en, es });

/**
 * Context value for localization
 */
const contextValue = {
  localization: LOCALES["en"],
  currentLocale: "",
  locales: [""],
  changeLocale: (value: LocaleKeyType) => {},
};

const LocalizationContext = createContext(contextValue);

export type LocaleKeyType = keyof typeof LOCALES;

export type LocaleValueType = (typeof LOCALES)[LocaleKeyType];

/**
 * Provider for locale localization.
 * Must be placed before any other provider.
 * @param {PropsWithChildren} props
 */
export const LocalizationProvider = (props: PropsWithChildren) => {
  const [currentLocale, setCurrentLocale] = useState<LocaleKeyType>("en");
  const [localization, setLocalization] = useState<LocaleValueType>(
    LOCALES["en"]
  );

  useEffect(() => {
    const language = navigator.language.split("-")[0].toLocaleLowerCase();
    changeLocale(language as LocaleKeyType);
  }, []);

  /**
   * Function to update locale inside the app
   * @param {keyof LOCALES} value
   */
  function changeLocale(value: LocaleKeyType) {
    setCurrentLocale(value);
    setLocalization(LOCALES[value]);
  }

  return (
    <LocalizationContext.Provider
      value={{
        localization,
        currentLocale,
        changeLocale,
        locales: Object.keys(LOCALES),
      }}
    >
      {props.children}
    </LocalizationContext.Provider>
  );
};

/**
 * Hook for handling localization across the app
 * @returns {typeof contextValue} Localization object
 */
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  return context;
};
