import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ES' | 'EN';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionary: Record<string, Record<Language, string>> = {
    // Sidebar
    'nav.home': { ES: 'Inicio', EN: 'Dashboard' },
    'nav.exercises': { ES: 'Ejercicios', EN: 'Exercises' },
    'nav.nutrition': { ES: 'Nutrición', EN: 'Nutrition' },
    'nav.community': { ES: 'Comunidad', EN: 'Community' },
    'nav.ai_coach': { ES: 'AI Coach', EN: 'AI Coach' },
    'nav.system': { ES: 'Sistema', EN: 'Design System' },
    'nav.profile': { ES: 'Perfil', EN: 'Profile' },
    'nav.panel': { ES: 'Panel Elite', EN: 'Elite Panel' },
    
    // Header
    'header.search': { ES: 'Buscar rutinas, comidas...', EN: 'Search routines, meals...' },
    'header.config': { ES: 'Configurar Plan', EN: 'Setup Plan' },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ES');

    const t = (key: string): string => {
        if (!dictionary[key]) return key;
        return dictionary[key][language];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};