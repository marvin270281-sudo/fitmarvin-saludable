import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
    const location = useLocation();
    const { t } = useLanguage();
    const isActive = (path: string) => location.pathname === path;
    const [avatar, setAvatar] = useState(IMAGES.USER_AVATAR);
    const [userName, setUserName] = useState('Marvin R.');
    const [userRole, setUserRole] = useState('Pro Member');

    // Effect to handle dynamic avatar and user data updates
    useEffect(() => {
        const loadUserData = () => {
            const storedAvatar = localStorage.getItem('userAvatar');
            const storedName = localStorage.getItem('userName');
            const storedRole = localStorage.getItem('userInstagram');

            if (storedAvatar) setAvatar(storedAvatar);
            if (storedName) setUserName(storedName);
            if (storedRole) setUserRole(storedRole);
        };

        loadUserData();
        window.addEventListener('user-update', loadUserData);
        return () => window.removeEventListener('user-update', loadUserData);
    }, []);

    const navItemClass = (path: string) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(path) ? 'bg-primary text-black font-semibold' : 'hover:bg-slate-100 dark:hover:bg-border-dark text-slate-600 dark:text-slate-300'}`;

    return (
        <aside className="w-72 h-full flex flex-col bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-dark p-6 shrink-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <Link to="/" className="block">
                    {/* 
                        DISPLAYING THE CUSTOM LOGO
                        Ensure the URL in constants.ts (IMAGES.LOGO) points to your hosted image file.
                    */}
                    <img
                        src={IMAGES.LOGO}
                        alt="FitMarvin"
                        className="h-28 w-auto object-contain"
                    />
                </Link>
            </div>

            <nav className="flex flex-col gap-2 flex-grow">
                <Link to="/" className={navItemClass('/')}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-sm">{t('nav.home')}</span>
                </Link>
                <Link to="/exercises" className={navItemClass('/exercises')}>
                    <span className="material-symbols-outlined">fitness_center</span>
                    <span className="text-sm">{t('nav.exercises')}</span>
                </Link>
                <Link to="/nutrition" className={navItemClass('/nutrition')}>
                    <span className="material-symbols-outlined">restaurant</span>
                    <span className="text-sm">{t('nav.nutrition')}</span>
                </Link>
                <Link to="/community" className={navItemClass('/community')}>
                    <span className="material-symbols-outlined">group</span>
                    <span className="text-sm">{t('nav.community')}</span>
                </Link>
                <Link to="/music" className={navItemClass('/music')}>
                    <span className="material-symbols-outlined">music_note</span>
                    <span className="text-sm">Música</span>
                </Link>
                <Link to="/design-system" className={navItemClass('/design-system')}>
                    <span className="material-symbols-outlined">architecture</span>
                    <span className="text-sm">{t('nav.system')}</span>
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-border-dark flex flex-col gap-2">
                <Link to="/profile" className={navItemClass('/profile')}>
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">{t('nav.profile')}</span>
                </Link>
                <div className="flex items-center gap-3 px-4 py-3 mt-2">
                    <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary/20 shrink-0" style={{ backgroundImage: `url('${avatar}')` }}></div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold truncate">{userName}</span>
                        <span className="text-sm text-primary font-bold truncate">{userRole}</span>
                    </div>
                </div>

                {/* Author Footer */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">
                        Creado por <span className="text-primary font-bold">Marcus De Araujo</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                        Enero 2026
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;