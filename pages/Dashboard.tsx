import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useUserStats } from '../context/UserStatsContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const [chartPeriod, setChartPeriod] = useState<'7D' | '30D'>('30D');
    const { totalUsers, onlineUsers, members } = useUserStats();

    const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR);
    const [userData, setUserData] = useState({
        name: localStorage.getItem('userName') || '',
        goal: localStorage.getItem('userGoal') || '',
        weight: parseFloat(localStorage.getItem('userWeight') || '78.5'),
        startWeight: 0,
        streak: 12
    });
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [communityPosts, setCommunityPosts] = useState<any[]>(() => {
        const stored = localStorage.getItem('community_posts');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        const user = localStorage.getItem('userName');
        const goal = localStorage.getItem('userGoal') || 'gain_muscle';
        const savedWeight = localStorage.getItem('userWeight');
        const storedAvatar = localStorage.getItem('userAvatar');

        if (!user) {
            navigate('/onboarding');
            return;
        }

        if (storedAvatar) setUserAvatar(storedAvatar);

        const currentWeight = savedWeight ? parseFloat(savedWeight) : 78.5;
        // Mock start weight based on goal for visual progress
        const isLosing = goal.includes('lose') || goal.includes('perder');
        const startW = isLosing ? currentWeight + 3.4 : currentWeight - 2.1;

        setUserData({
            name: user,
            goal: goal,
            weight: currentWeight,
            startWeight: parseFloat(startW.toFixed(1)),
            streak: 12 // Mock streak matching nutrition plan
        });

        const handleUserUpdate = () => {
            const storedAvatar = localStorage.getItem('userAvatar');
            if (storedAvatar) setUserAvatar(storedAvatar);
            const storedName = localStorage.getItem('userName');
            if (storedName) setUserData(prev => ({ ...prev, name: storedName }));
        };

        window.addEventListener('user-update', handleUserUpdate);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'community_posts') {
                setCommunityPosts(JSON.parse(e.newValue || '[]'));
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('user-update', handleUserUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);

    const getGoalLabel = (goalId: string) => {
        switch (goalId) {
            case 'gain_fat': return 'Ganar Peso';
            case 'lose_fat': return 'Perder Grasa';
            case 'gain_muscle': return 'Ganar Músculo';
            case 'gain_endurance': return 'Resistencia';
            default: return 'Estar en forma';
        }
    };

    const weightDiff = userData.weight - userData.startWeight;
    const weightDiffLabel = weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1);
    const isPositiveChange = (userData.goal.includes('loss') && weightDiff < 0) || (userData.goal.includes('gain') && weightDiff > 0);

    return (
        <div className="flex h-full flex-col">
            <main className="flex-grow flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
                <div className="flex-grow overflow-y-auto custom-scrollbar px-6 md:px-12 py-8 max-w-screen-2xl mx-auto w-full">

                    {/* COMMUNITY MEMBERS PANEL (Visible to Everyone) */}
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">groups</span>
                                Nuestra Comunidad
                            </h3>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2 border border-primary/20">
                                <span className="text-xs font-black">{totalUsers} {totalUsers === 1 ? 'miembro' : 'miembros'}</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-yellow-500">person</span>
                                    Gente en FitMarvin
                                </h4>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400 tabular-nums uppercase tracking-tighter">
                                        {onlineUsers} online
                                    </span>
                                </div>
                            </div>

                            {members.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {members.map((member) => {
                                            const isCreator = member.name === 'Marvin De Araujo';
                                            const isNew = Date.now() - member.timestamp < 3600000 * 24; // New for 24 hours

                                            const isMe = member.name === userData.name;

                                            return (
                                                <div
                                                    key={member.id}
                                                    onClick={() => setSelectedMember(member)}
                                                    className={`p-4 rounded-2xl border flex items-center justify-between group transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md cursor-pointer ${isCreator ? 'bg-primary/5 border-primary/20 dark:bg-primary/5 dark:border-primary/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div
                                                                className={`size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 ${isCreator ? 'border-primary shadow-lg shadow-primary/20' : 'border-white dark:border-surface-dark shadow-sm'}`}
                                                                style={{ backgroundImage: `url('${isMe ? userAvatar : member.avatar}')` }}
                                                            ></div>
                                                            {isCreator && (
                                                                <div className="absolute -top-2 -right-1 bg-yellow-400 text-white size-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-dark">
                                                                    <span className="material-symbols-outlined text-[10px] font-black">grade</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className={`font-bold leading-tight truncate text-sm ${isCreator ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>
                                                                {member.name}
                                                            </p>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                {isCreator ? (
                                                                    <span className="text-[8px] bg-primary text-black font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Creador</span>
                                                                ) : isNew ? (
                                                                    <span className="text-[8px] bg-green-500 text-white font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter flex items-center gap-0.5">
                                                                        <span className="size-1 bg-white rounded-full animate-pulse"></span>
                                                                        Nuevo
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest italic">Miembro</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {member.name !== userData.name && (
                                                        <button
                                                            onClick={() => {
                                                                const messages = isCreator
                                                                    ? [`¡Un saludo de Marvin! 💪`, `¡Motivación máxima! 🔥`, `¡Bienvenido a mi familia fitness! 🏆`]
                                                                    : [`¡Hola ${member.name.split(' ')[0]}! 💪`, `¡A darle con todo! 🔥`, `¡Vamos a por ello! 🏆`];
                                                                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                                                                alert(`Has saludado a ${member.name}:\n\n"${randomMsg}"`);
                                                            }}
                                                            className={`px-3 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all ${isCreator ? 'bg-primary text-black shadow-lg shadow-primary/20 hover:scale-105' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-black'}`}
                                                        >
                                                            {isCreator ? 'Seguir' : 'Saludar'}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 flex flex-col items-center text-center">
                                    <p className="text-slate-400 text-sm font-bold italic">¡Sé el primero en unirte a la conversación!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 1. PERSONAL HEADER SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        {/* User Profile Card */}
                        <div className="col-span-1 lg:col-span-1 bg-white dark:bg-surface-dark rounded-3xl p-6 border border-slate-200 dark:border-border-dark flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
                            <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-white dark:bg-surface-dark mb-3 ring-4 ring-primary/20">
                                <img src={userAvatar} alt="User" className="w-full h-full rounded-full object-cover" />
                                <button onClick={() => navigate('/profile')} className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg" title="Editar foto">
                                    <span className="material-symbols-outlined text-xs">edit</span>
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">¡Hola, {userData.name}!</h2>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                {getGoalLabel(userData.goal)}
                            </span>
                            <div className="flex gap-2 w-full mt-auto">
                                <button onClick={() => navigate('/profile')} className="flex-1 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                    Ver Perfil
                                </button>
                                <button onClick={() => navigate('/profile')} className="flex-1 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                                    Ajustes
                                </button>
                            </div>
                        </div>

                        {/* Stats & Motivation Grid */}
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Stat 1: Current Weight */}
                            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between group hover:border-primary/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg material-symbols-outlined">monitor_weight</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${weightDiff < 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {weightDiffLabel} kg
                                    </span>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">{userData.weight} <span className="text-sm font-bold text-slate-400">kg</span></p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Peso Actual</p>
                                </div>
                            </div>

                            {/* Stat 2: Streak */}
                            <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm flex flex-col justify-between group hover:border-orange-500/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-lg material-symbols-outlined">local_fire_department</span>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">{userData.streak} <span className="text-sm font-bold text-slate-400">días</span></p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Racha Activa</p>
                                </div>
                            </div>

                            {/* Stat 3: Workouts (Mock) */}
                            <div className="hidden md:flex bg-white dark:bg-surface-dark p-5 rounded-2xl border border-slate-200 dark:border-border-dark shadow-sm flex-col justify-between group hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-lg material-symbols-outlined">fitness_center</span>
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white">8 <span className="text-sm font-bold text-slate-400">/ 12</span></p>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Entrenos Mes</p>
                                </div>
                            </div>

                            {/* Motivation Card */}
                            <div className="col-span-2 md:col-span-3 bg-slate-900 rounded-2xl p-6 relative overflow-hidden flex items-center shadow-lg group">
                                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${IMAGES.MARVIN_COLLAGE}')` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                                <div className="relative z-10 max-w-lg">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-bold uppercase tracking-widest text-xs">
                                        <span className="material-symbols-outlined text-sm">lightbulb</span>
                                        Motivación Diaria
                                    </div>
                                    <p className="text-white text-lg md:text-xl font-medium italic leading-relaxed">
                                        "No busques excusas, busca resultados. Tu mejor versión te está esperando."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. ACHIEVEMENTS BANNER */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Tus Logros Recientes</h3>
                            <button className="text-primary text-xs font-bold hover:underline">Ver todos</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: 'Primeros Pasos', icon: 'footprint', color: 'bg-green-500', done: true },
                                { title: '1 Semana', icon: 'calendar_month', color: 'bg-blue-500', done: true },
                                { title: 'Bestia Gym', icon: 'exercise', color: 'bg-purple-500', done: false },
                                { title: 'Chef Fit', icon: 'restaurant', color: 'bg-orange-500', done: userData.streak > 10 }
                            ].map((badge, i) => (
                                <div key={i} className={`p-4 rounded-xl border ${badge.done ? 'bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark' : 'bg-slate-50 dark:bg-white/5 border-transparent opacity-60'} flex items-center gap-3 shadow-sm`}>
                                    <div className={`p-3 rounded-full ${badge.color} text-white shrink-0`}>
                                        <span className="material-symbols-outlined text-xl">{badge.icon}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{badge.title}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{badge.done ? 'Completado' : 'Pendiente'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. EXISTING CONTENT GRID */}
                    <div className="grid grid-cols-12 gap-6 auto-rows-[160px]">
                        {/* Featured Workout */}
                        <div className="col-span-12 md:col-span-8 row-span-2 bento-card bg-slate-900 dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-8 rounded-2xl relative overflow-hidden flex flex-col justify-end group cursor-pointer shadow-lg" onClick={() => navigate('/exercises')}>
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                                <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${IMAGES.MARVIN_BIKE}')` }}></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-primary/20 backdrop-blur-md text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/30">Tu Selección de Hoy</span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2">Sesión de Cardio Intensiva</h3>
                                <div className="flex items-center gap-6 text-slate-300 text-sm mb-6">
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">schedule</span> 45 min</span>
                                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">monitoring</span> Resistencia</span>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-black px-8 py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 w-fit">
                                    Empezar Entrenamiento
                                </button>
                            </div>
                        </div>

                        {/* Updated Community Card */}
                        <div className="col-span-12 md:col-span-4 row-span-2 bento-card bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl flex flex-col shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="p-1 bg-green-100 text-green-600 rounded-md material-symbols-outlined text-sm">group</span>
                                    Comunidad Live
                                </span>
                                <span className="text-xs font-bold text-green-500 animate-pulse">{onlineUsers} Online</span>
                            </div>
                            <div className="flex flex-col gap-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
                                {communityPosts.length > 0 ? (
                                    communityPosts.slice(0, 3).map((post, i) => (
                                        <div key={post.id || i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-slate-100 dark:border-white/5 cursor-pointer group" onClick={() => navigate('/community')}>
                                            <div
                                                className="size-10 shrink-0 rounded-full bg-cover bg-center border-2 border-white dark:border-surface-dark shadow-sm"
                                                style={{ backgroundImage: `url('${(post.user === userData.name) ? userAvatar : (post.avatar || IMAGES.USER_AVATAR)}')` }}
                                            ></div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold mb-0.5 group-hover:text-primary transition-colors truncate">{post.user}</p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 italic">
                                                    "{post.text || 'Sin texto'}"
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                        <div className="size-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-3">
                                            <span className="material-symbols-outlined text-slate-300">celebration</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">
                                            ¡Muro listo!<br />Sé el primero en saludar
                                        </p>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => navigate('/community')} className="w-full mt-4 py-3 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
                                Unirse a la conversación
                            </button>
                        </div>
                    </div>

                    {/* 4. PROGRESS CHART (Preserved but styled) */}
                    <div className="mt-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Evolución de Peso</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-4xl font-black">{userData.weight} kg</span>
                                    <span className={`text-sm font-bold ${weightDiff < 0 ? 'text-green-500' : 'text-orange-500'}`}>
                                        {weightDiffLabel} kg total
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setChartPeriod('30D')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${chartPeriod === '30D' ? 'bg-primary text-black' : 'bg-slate-100 dark:bg-border-dark text-slate-500'}`}
                                >
                                    30 Días
                                </button>
                            </div>
                        </div>
                        <div className="h-40 flex items-end justify-between gap-2 px-2">
                            {/* Simple Bar Chart Mockup */}
                            {[45, 50, 48, 52, 55, 53, 58, 60, 59, 62, 65, 60, 68, 70, 72].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-md relative group h-full flex items-end">
                                    <div className="w-full bg-primary/40 group-hover:bg-primary transition-all rounded-t-md" style={{ height: `${h}%` }}></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        Día {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* Profile Detail Modal - Compact & Professional */}
            {selectedMember && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white dark:bg-surface-dark max-w-[340px] w-full rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/5"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Compact Header/Banner */}
                        <div className="h-20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent relative">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 text-white rounded-full p-1.5 backdrop-blur-md transition-all z-10"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        {/* Profile Info - Tighter spacing */}
                        <div className="px-6 pb-6 -mt-10 text-center">
                            <div className="relative inline-block mb-3">
                                <div className="size-24 rounded-[24px] mx-auto bg-white dark:bg-surface-dark p-1 shadow-xl relative z-10 ring-2 ring-primary/5">
                                    <div
                                        className="w-full h-full rounded-[18px] bg-slate-200 bg-cover bg-center"
                                        style={{ backgroundImage: `url('${selectedMember.name === userData.name ? userAvatar : selectedMember.avatar}')` }}
                                    ></div>
                                </div>
                                {selectedMember.name === userData.name && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black size-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-surface-dark z-20">
                                        <span className="material-symbols-outlined text-sm font-black">grade</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                {selectedMember.name}
                            </h3>

                            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                                {selectedMember.name === userData.name ? (
                                    <span className="bg-primary px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-black">TÚ</span>
                                ) : (Date.now() - selectedMember.timestamp < 3600000 * 24) ? (
                                    <span className="bg-green-500 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                                        <span className="size-1 bg-white rounded-full animate-pulse"></span>
                                        NUEVO
                                    </span>
                                ) : (
                                    <span className="bg-slate-100 dark:bg-white/10 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">MIEMBRO</span>
                                )}
                            </div>

                            {/* stats - Compact Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Plan</p>
                                    <p className="text-sm font-black">{selectedMember.name === 'Marvin De Araujo' ? getGoalLabel(userData.goal) : 'Hipertrofia'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Racha</p>
                                    <p className="text-sm font-black">{selectedMember.name === userData.name ? userData.streak : 1} Días</p>
                                </div>
                            </div>

                            {/* Training Details for all (more tailored) */}
                            <div className="bg-slate-900 text-white p-4 rounded-2xl mb-5 border border-white/5 text-left">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-2">Estado de Entrenamiento</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Peso</p>
                                        <p className="text-xs font-black text-primary">{selectedMember.name === userData.name ? userData.weight : (selectedMember.weight || '76.4')} kg</p>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Objetivo</p>
                                        <p className="text-xs font-black text-primary">{selectedMember.name === userData.name ? getGoalLabel(userData.goal) : 'Fuerza'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions - Smaller Buttons */}
                            <div className="grid grid-cols-1 gap-2">
                                <a
                                    href="https://www.instagram.com/fitmarvin_dev/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-[#E1306C] text-white font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">share</span>
                                    Instagram
                                </a>
                                {selectedMember.name !== userData.name && (
                                    <button
                                        onClick={() => {
                                            alert(`¡Motivación enviada a ${selectedMember.name}! 💪`);
                                            setSelectedMember(null);
                                        }}
                                        className="w-full py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">celebration</span>
                                        Saludar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;