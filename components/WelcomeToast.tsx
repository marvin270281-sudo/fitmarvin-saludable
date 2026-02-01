import React from 'react';
import { useUserStats } from '../context/UserStatsContext';

const WelcomeToast = () => {
    const { lastJoiner } = useUserStats();

    if (!lastJoiner) return null;

    return (
        <div className="fixed bottom-24 left-6 z-[100] animate-in slide-in-from-left duration-700 pointer-events-none">
            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm pointer-events-auto">
                <div className="relative">
                    <div
                        className="size-12 rounded-full bg-slate-200 bg-cover bg-center border-2 border-primary"
                        style={{ backgroundImage: `url('${lastJoiner.avatar}')` }}
                    ></div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white size-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-dark animate-bounce">
                        <span className="material-symbols-outlined text-xs">emoji_events</span>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">¡Nuevo Miembro!</h4>
                    <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">
                        {lastJoiner.name} se acaba de unir al grupo.
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">Bienvenidos a la familia FitMarvin 🏆</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeToast;
