import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants';
import SupportModal from './SupportModal';
import { useTranslation } from '../context/LanguageContext';


const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);

    const handleCreatorClick = () => {
        if (location.pathname === '/about-creator') {
            navigate(-1); // Go back if already there (toggle close)
        } else {
            navigate('/about-creator'); // Open if not there
        }
    };

    return (
        <footer className="w-full py-1.5 md:py-2 px-6 md:px-12 bg-card-light dark:bg-surface-dark border-t border-slate-200 dark:border-border-dark mt-auto z-10 shrink-0">
            <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-center">
                <button
                    onClick={handleCreatorClick}
                    className="flex flex-wrap items-center justify-center gap-2 md:gap-3 hover:opacity-80 transition-opacity group cursor-pointer text-center bg-transparent border-none p-0"
                >
                    <img
                        src={IMAGES.LOGO}
                        alt="FitMarvin Logo"
                        className="h-5 md:h-6 w-auto object-contain"
                    />
                    <span className="text-[10px] md:text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                        {t('footer.creator')} • {t('footer.rights')} • 2026
                    </span>
                    <div onClick={(e) => { e.stopPropagation(); setIsSupportModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-full border border-rose-500/10 transition-all text-[10px] font-black uppercase tracking-widest ml-4" title={t('footer.support')}>
                        <span className="material-symbols-outlined text-xs">volunteer_activism</span>
                        {t('footer.support')}
                    </div>
                </button>
            </div>
            <SupportModal
                isOpen={isSupportModalOpen}
                onClose={() => setIsSupportModalOpen(false)}
            />
        </footer>
    );
};

export default Footer;
