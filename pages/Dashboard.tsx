import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../context/UserStatsContext';
import { useRoutine } from '../context/RoutineContext';
import { useTranslation } from '../context/LanguageContext';
import EvolutionChart from '../components/EvolutionChart';
import HealthTracker from '../components/HealthTracker';
import { IMAGES } from '../constants';
import { EXERCISE_DB } from './Exercises';


const Dashboard = () => {
    const navigate = useNavigate();
    const { totalUsers } = useUserStats();
    const { routineIds } = useRoutine();
    const { t } = useTranslation();
    
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR);
    const [weight, setWeight] = useState(() => localStorage.getItem('userWeight') || '0');
    const [height, setHeight] = useState(() => localStorage.getItem('userHeight') || '0');
    const [goal, setGoal] = useState(() => localStorage.getItem('userGoal') || '');
    const [greetingMessage, setGreetingMessage] = useState<string | null>(null);
    
    // Mock Online Users
    const onlineUsersList = [
        { id: 1, name: 'Lucas Silva', avatar: 'https://i.pravatar.cc/150?u=lucas', level: 'Pro' },
        { id: 2, name: 'Elena Meyer', avatar: 'https://i.pravatar.cc/150?u=elena', level: 'Elite' },
        { id: 3, name: 'João Santos', avatar: 'https://i.pravatar.cc/150?u=joao', level: 'Starter' },
    ];

    const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>(() => {
        const stored = localStorage.getItem('userWeightHistory');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        const stored = localStorage.getItem('userName');
        if (!stored) {
            navigate('/onboarding');
        } else {
            setUserName(stored);
        }
    }, [navigate]);

    const userExercises = EXERCISE_DB.filter(ex => routineIds.includes(ex.id));

    const handleGreet = (name: string) => {
        setGreetingMessage(t('dashboard.greeting_sent', { name }));
        setTimeout(() => setGreetingMessage(null), 3000);
    };

    return (
        <div className="p-6 max-w-screen-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Greeting Toast */}
            {greetingMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
                    <div className="bg-primary text-black px-6 py-3 rounded-full font-black shadow-2xl flex items-center gap-2 border-2 border-white/20">
                        <span className="material-symbols-outlined">celebration</span>
                        {greetingMessage}
                    </div>
                </div>
            )}

            {/* User Profile Section */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <span className="material-symbols-outlined text-9xl">person</span>
                </div>
                
                <div className="relative">
                    <img
                        src={avatar}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-black p-2 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-sm font-bold">verified</span>
                    </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">
                        {t('dashboard.welcome', { name: userName })}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                        <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">scale</span>
                            <span className="font-bold">{weight} kg</span>
                        </div>
                        <div className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">straighten</span>
                            <span className="font-bold">{height} cm</span>
                        </div>
                    </div>
                    {goal && (
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary font-black uppercase tracking-widest text-xs">
                            <span className="material-symbols-outlined text-sm">flag</span>
                            {t(`goal.${goal}`)}
                        </div>
                    )}
                </div>
                
                <div className="text-right flex flex-col items-center md:items-end gap-2">
                    <div className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full font-bold text-xs">
                        {t('dashboard.total_users', { count: totalUsers })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Section */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">monitoring</span>
                            {t('dashboard.evolution')}
                        </h2>
                        {weightHistory.length > 0 ? (
                            <EvolutionChart data={weightHistory} />
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                                <span className="material-symbols-outlined text-5xl mb-2">analytics</span>
                                <p className="font-bold">{t('dashboard.no_weight_data')}</p>
                            </div>
                        )}
                    </section>

                    <section>
                        <HealthTracker />
                    </section>
                </div>

                {/* My Routine Section */}
                <div className="space-y-8">
                    <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">fitness_center</span>
                            {t('dashboard.routine')}
                        </h2>
                        
                        <div className="space-y-4">
                            {userExercises.length > 0 ? (
                                userExercises.map(ex => (
                                    <div key={ex.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200">
                                            <img src={ex.img} alt={ex.details.ES.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm">{ex.details.ES.title}</h3>
                                            <p className="text-xs text-slate-500">{ex.details.ES.muscle}</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">play_circle</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 px-6 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <p className="text-slate-400 text-sm font-medium mb-4">{t('dashboard.no_exercises')}</p>
                                    <button 
                                        onClick={() => navigate('/exercises')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">add_circle</span>
                                        {t('dashboard.explore')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Online Now Section */}
                    <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">groups</span>
                                {t('dashboard.online_now')}
                            </h2>
                            <span className="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">LIVE</span>
                        </div>
                        
                        <div className="space-y-3">
                            {onlineUsersList.map(user => (
                                <div key={user.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
                                    <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover border-2 border-primary/20" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs truncate">{user.name}</p>
                                        <p className="text-[9px] text-primary font-black uppercase tracking-tighter opacity-70">{user.level} {t('common.pro_member').split(' ')[1] || 'Member'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleGreet(user.name)}
                                        className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                                        title={t('dashboard.greet')}
                                    >
                                        <span className="material-symbols-outlined text-sm">waving_hand</span>
                                    </button>
                                </div>
                            ))}
                            <p className="text-[10px] text-slate-400 text-center mt-4 italic">{t('dashboard.online_desc')}</p>
                        </div>
                    </section>

                    {/* Achievements */}
                    <section className="bg-gradient-to-br from-primary/20 to-transparent rounded-3xl p-6 border border-primary/20">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">workspace_premium</span>
                            {t('dashboard.achievements')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'first_steps', icon: 'bolt' },
                                { key: 'one_week', icon: 'bolt' },
                                { key: 'gym_beast', icon: 'bolt' },
                                { key: 'chef_fit', icon: 'restaurant' }
                            ].map(ach => (
                                <div key={ach.key} className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl text-center">
                                    <div className="size-12 bg-primary text-black rounded-full flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined">{ach.icon}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{t(`ach.${ach.key}`)}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
