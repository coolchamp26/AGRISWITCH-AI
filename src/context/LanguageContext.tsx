'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Language } from '@/types';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

type TranslationData = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationData;
}

const translations: Record<Language, TranslationData> = { en, hi };

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => { },
    t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
