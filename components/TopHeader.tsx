import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUserStats } from '../context/UserStatsContext';
import { IMAGES } from '../constants';

const TopHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const { onlineUsers, lastJoiner } = useUserStats();
    const [hasNotifs, setHasNotifs] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
    const [userInstagram, setUserInstagram] = useState(() => localStorage.getItem('userInstagram')?.replace('@', '') || 'fitmarvin_dev');

    const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR);
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Marvin De Araujo');
    const [userRole, setUserRole] = useState(() => (localStorage.getItem('userRole') as 'user' | 'admin') || 'user');

    // Listen for profile updates
    React.useEffect(() => {
        const handleUserUpdate = () => {
            const storedAvatar = localStorage.getItem('userAvatar');
            const storedName = localStorage.getItem('userName');
            const storedInsta = localStorage.getItem('userInstagram');
            const storedRole = localStorage.getItem('userRole') as 'user' | 'admin';

            if (storedAvatar) setUserAvatar(storedAvatar);
            if (storedName) setUserName(storedName);
            if (storedInsta) setUserInstagram(storedInsta.replace('@', ''));
            if (storedRole) setUserRole(storedRole);
        };

        window.addEventListener('user-update', handleUserUpdate);
        return () => window.removeEventListener('user-update', handleUserUpdate);
    }, []);

    // Close menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItemClass = (path: string) => `flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${location.pathname === path ? 'bg-primary text-black font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300'}`;
    const mobileNavItemClass = (path: string) => `flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-white/5 text-lg transition-all ${location.pathname === path ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`;

    return (
        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-border-dark shrink-0 bg-card-light dark:bg-surface-dark z-50 sticky top-0 shadow-sm flex items-center">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-12 w-full relative">

                {/* 1. Left: Hamburger (Mobile) + Logo */}
                <div className="flex items-center gap-4">
                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-3xl text-slate-700 dark:text-slate-200">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>

                    {/* Logo - Absolute Positioning to avoid stretching navbar */}
                    <div
                        onClick={() => setIsLogoModalOpen(true)}
                        className="cursor-pointer transition-all active:scale-95 group relative z-50"
                    >
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 min-w-[120px] md:min-w-[200px]">
                            <img
                                src={IMAGES.LOGO}
                                alt="FitMarvin"
                                className="h-20 md:h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] group-hover:drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] transition-all duration-300 transform group-hover:scale-105"
                            />
                        </div>
                        {/* Placeholder box to maintain some horizontal space for the logo in the flex layout */}
                        <div className="h-12 w-24 md:w-48 invisible"></div>
                    </div>
                </div>

                {/* 2. Middle: Desktop Navigation (Hidden on Mobile) */}
                <nav className="hidden md:flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-full border border-slate-200 dark:border-white/5">
                    <Link to="/" className={navItemClass('/')}>
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        <span className="text-sm">{t('nav.home')}</span>
                    </Link>
                    <Link to="/walking" className={navItemClass('/walking')}>
                        <span className="material-symbols-outlined text-lg">directions_walk</span>
                        <span className="text-sm">Caminata</span>
                    </Link>
                    <Link to="/cycling" className={navItemClass('/cycling')}>
                        <span className="material-symbols-outlined text-lg">directions_bike</span>
                        <span className="text-sm">Ciclismo</span>
                    </Link>
                    <Link to="/exercises" className={navItemClass('/exercises')}>
                        <span className="material-symbols-outlined text-lg">fitness_center</span>
                        <span className="text-sm">{t('nav.exercises')}</span>
                    </Link>
                    <Link to="/nutrition" className={navItemClass('/nutrition')}>
                        <span className="material-symbols-outlined text-lg">restaurant</span>
                        <span className="text-sm">{t('nav.nutrition')}</span>
                    </Link>
                    <Link to="/community" className={navItemClass('/community')}>
                        <span className="material-symbols-outlined text-lg">group</span>
                        <span className="text-sm">{t('nav.community')}</span>
                    </Link>
                </nav>

                {/* 3. Right: User Profile & Actions */}
                <div className="flex items-center gap-2 md:gap-4">


                    <div className="hidden lg:flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 relative group">
                        {lastJoiner && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce flex items-center gap-1 shadow-lg whitespace-nowrap">
                                <span className="material-symbols-outlined text-[10px]">emoji_events</span>
                                ¡NUEVO!
                            </div>
                        )}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 tabular-nums">
                            {onlineUsers} online
                        </span>
                    </div>

                    <Link to="/profile" className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 md:border-l border-slate-200 dark:border-white/10 hover:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold leading-none dark:text-white">{userName}</p>
                            {userRole === 'admin' ? (
                                <p className="text-[10px] text-primary font-black uppercase tracking-tighter flex items-center justify-end gap-1">
                                    <span className="material-symbols-outlined text-[10px]">verified</span>
                                    Creador
                                </p>
                            ) : (
                                <p className="text-[10px] text-primary font-bold">Pro Member</p>
                            )}
                        </div>
                        <div className="size-8 md:size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-primary" style={{ backgroundImage: `url('${userAvatar}')` }}></div>
                    </Link>
                </div>
            </div>

            {/* 4. Mobile Menu Overlay (Visible when isOpen) */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark shadow-2xl animate-in slide-in-from-top-5 duration-200 overflow-y-auto max-h-[80vh]">
                    <div className="p-4 flex flex-col">
                        <div className="mb-4 pb-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Menú Principal</span>
                            <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                                    {onlineUsers} active
                                </span>
                            </div>
                        </div>

                        <nav className="flex flex-col">
                            <Link to="/" className={mobileNavItemClass('/')}>
                                <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">dashboard</span>
                                </div>
                                <span className="font-medium">{t('nav.home')}</span>
                            </Link>
                            <Link to="/walking" className={mobileNavItemClass('/walking')}>
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">directions_walk</span>
                                </div>
                                <span className="font-medium">Caminata Virtual</span>
                            </Link>
                            <Link to="/cycling" className={mobileNavItemClass('/cycling')}>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">directions_bike</span>
                                </div>
                                <span className="font-medium">Ciclismo Virtual</span>
                            </Link>
                            <Link to="/exercises" className={mobileNavItemClass('/exercises')}>
                                <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                    <span className="material-symbols-outlined text-xl">fitness_center</span>
                                </div>
                                <span className="font-medium">{t('nav.exercises')}</span>
                            </Link>
                            <Link to="/nutrition" className={mobileNavItemClass('/nutrition')}>
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">restaurant</span>
                                </div>
                                <span className="font-medium">{t('nav.nutrition')}</span>
                            </Link>
                            <Link to="/community" className={mobileNavItemClass('/community')}>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                    <span className="material-symbols-outlined text-xl">group</span>
                                </div>
                                <span className="font-medium">{t('nav.community')}</span>
                            </Link>

                        </nav>
                    </div>
                </div>
            )}

            {/* LOGO FULLSCREEN MODAL */}
            {isLogoModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setIsLogoModalOpen(false)}
                >
                    <div
                        className="relative max-w-2xl w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsLogoModalOpen(false)}
                            className="absolute -top-12 right-0 md:-right-12 text-white hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-4xl">close</span>
                        </button>

                        {/* Large Logo */}
                        <div className="bg-white/5 p-8 rounded-full mb-8 ring-1 ring-white/10 shadow-2xl shadow-primary/20">
                            <img
                                src={IMAGES.LOGO}
                                alt="FitMarvin Logo Large"
                                className="w-48 md:w-64 h-auto object-contain drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] animate-pulse-slow"
                            />
                        </div>

                        {/* App Name & Slogan */}
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                            FIT<span className="text-primary">MARVIN</span>
                        </h1>
                        <p className="text-slate-400 text-xl md:text-2xl font-medium mb-10 max-w-md">
                            Tu compañero definitivo en el camino hacia una vida saludable.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={() => {
                                    setIsLogoModalOpen(false);
                                    navigate('/');
                                }}
                                className="px-8 py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/30"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Ir al Inicio
                            </button>

                            <a
                                href="https://www.instagram.com/fitmarvin_dev/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/20"
                            >
                                <span className="material-symbols-outlined">share</span>
                                Ver Instagram
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default TopHeader;