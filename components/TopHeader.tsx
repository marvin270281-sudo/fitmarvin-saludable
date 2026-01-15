import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const TopHeader = () => {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    const [hasNotifs, setHasNotifs] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Redirigir a la zona de ejercicios si hay búsqueda
        if (searchTerm.trim()) {
            navigate('/exercises');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 dark:border-border-dark shrink-0 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-20">
            <div className="w-96 bg-white dark:bg-surface-dark p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark transition-all focus-within:ring-2 focus-within:ring-primary/50 flex items-center">
                <div className="flex-1 relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-slate-400 text-xl">search</span>
                    <input 
                        className="w-full pl-10 pr-2 py-1.5 border-none bg-transparent text-sm focus:outline-none dark:text-slate-200 placeholder:text-slate-400" 
                        placeholder={t('header.search')}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <button 
                    onClick={handleSearch}
                    className="bg-primary text-black px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm hover:bg-primary/90 transition-colors"
                >
                    {language === 'ES' ? 'Ir' : 'Go'}
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex bg-slate-100 dark:bg-surface-dark p-1 rounded-lg">
                    <button 
                        onClick={() => setLanguage('ES')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'ES' ? 'bg-white dark:bg-primary text-slate-900 dark:text-black shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
                    >
                        ES
                    </button>
                    <button 
                        onClick={() => setLanguage('EN')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'EN' ? 'bg-white dark:bg-primary text-slate-900 dark:text-black shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
                    >
                        EN
                    </button>
                </div>
                <button 
                    onClick={() => setHasNotifs(false)}
                    className="relative p-2.5 text-slate-400 hover:text-primary dark:bg-surface-dark rounded-xl transition-all border border-transparent hover:border-border-dark"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    {hasNotifs && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>}
                </button>
                <button onClick={() => navigate('/onboarding')} className="flex items-center gap-2 bg-primary px-5 py-2.5 rounded-xl text-black text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-xl">add</span>
                    {t('header.config')}
                </button>
            </div>
        </header>
    );
};

export default TopHeader;