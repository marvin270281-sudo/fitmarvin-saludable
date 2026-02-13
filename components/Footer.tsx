import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
                        Aplicación creada por Marcus De Araujo , Enero 2026 con todos los derechos.
                    </span>
                    <div onClick={(e) => { e.stopPropagation(); alert('Puedes apoyar el proyecto vía Bizum al número: 600 000 000 (Marcus De Araujo). ¡Muchas gracias!'); }} className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-full border border-rose-500/10 transition-all text-[10px] font-black uppercase tracking-widest ml-4">
                        <span className="material-symbols-outlined text-xs">volunteer_activism</span>
                        Bizum
                    </div>
                </button>
            </div>
        </footer>
    );
};

export default Footer;
