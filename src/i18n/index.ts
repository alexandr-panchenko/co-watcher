import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from '../locales/en/common.json';
import homeEn from '../locales/en/home.json';
import discoveryEn from '../locales/en/discovery.json';
import sessionEn from '../locales/en/session.json';
import assemblyEn from '../locales/en/assembly.json';
import modalsEn from '../locales/en/modals.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: commonEn,
    home: homeEn,
    discovery: discoveryEn,
    session: sessionEn,
    assembly: assemblyEn,
    modals: modalsEn,
  },
} as const;

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'home', 'discovery', 'session', 'assembly', 'modals'],
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
