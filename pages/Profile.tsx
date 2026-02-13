import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStats } from '../context/UserStatsContext';
import AttendanceCalendar from '../components/AttendanceCalendar';
import EvolutionChart from '../components/EvolutionChart';
import { IMAGES } from '../constants';

const ProfileSettings = () => {
    const navigate = useNavigate();
    // Check initial dark mode from html class
    const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
    const { deleteAccount, logout, totalUsers, joinQueue, markAsWelcomed } = useUserStats();
    const [avatar, setAvatar] = useState(() => localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR);

    // Editable States
    const [name, setName] = useState(() => localStorage.getItem('userName') || 'Marvin De Araujo');
    const [weight, setWeight] = useState(() => localStorage.getItem('userWeight') || '75');
    const [height, setHeight] = useState(() => localStorage.getItem('userHeight') || '180');
    const [instagram, setInstagram] = useState(() => localStorage.getItem('userInstagram') || '@marvin_dev2026');
    const [phone, setPhone] = useState(() => localStorage.getItem('userPhone') || '');
    const [goal, setGoal] = useState(() => localStorage.getItem('userGoal') || '');
    const [role, setRole] = useState<'user' | 'admin'>(() => (localStorage.getItem('userRole') as 'user' | 'admin') || 'user');

    // New Features state
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | undefined>>(() => {
        const stored = localStorage.getItem('userAttendance');
        return stored ? JSON.parse(stored) : {};
    });
    const [weightHistory, setWeightHistory] = useState<{ date: string, weight: number }[]>(() => {
        const stored = localStorage.getItem('userWeightHistory');
        return stored ? JSON.parse(stored) : [];
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load data corrections on mount if needed
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (!storedName) {
            navigate('/onboarding');
            return;
        }

        const storedWeight = localStorage.getItem('userWeight');
        if (weightHistory.length === 0 && storedWeight) {
            setWeightHistory([{ date: new Date().toISOString().split('T')[0], weight: parseFloat(storedWeight) }]);
        }
    }, [navigate]);

    // AUTO-SAVE LOGIC
    useEffect(() => {
        if (!name) return;
        localStorage.setItem('userName', name);
        localStorage.setItem('userWeight', weight);
        localStorage.setItem('userHeight', height);
        localStorage.setItem('userInstagram', instagram);
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userAvatar', avatar);
        localStorage.setItem('userGoal', goal);

        // Dispatch event for sidebar/context updates
        window.dispatchEvent(new Event('user-update'));
    }, [name, weight, height, instagram, phone, avatar, goal]);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    const handleSave = () => {
        // Since we have auto-save, this manually triggers the feedback UI
        // and ensures weight history is updated (which we might want only on manual save or periodically)

        const today = new Date().toISOString().split('T')[0];
        const currentWeightVal = parseFloat(weight);

        let newHistory = [...weightHistory];
        const existingEntryIndex = newHistory.findIndex(h => h.date === today);

        if (existingEntryIndex >= 0) {
            newHistory[existingEntryIndex].weight = currentWeightVal;
        } else {
            newHistory.push({ date: today, weight: currentWeightVal });
        }

        newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setWeightHistory(newHistory);
        localStorage.setItem('userWeightHistory', JSON.stringify(newHistory));
        localStorage.setItem('userAttendance', JSON.stringify(attendance));

        // UI Feedback
        const btn = document.getElementById('save-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined">check</span> Guardado';
            btn.classList.add('bg-green-500', 'text-white');
            btn.classList.remove('bg-primary', 'text-black');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-green-500', 'text-white');
                btn.classList.add('bg-primary', 'text-black');
            }, 2000);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatar(base64String);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleToggleAttendance = (dateKey: string) => {
        const newAttendance = { ...attendance };
        const currentStatus = newAttendance[dateKey];

        if (currentStatus === 'present') {
            newAttendance[dateKey] = 'absent';
        } else if (currentStatus === 'absent') {
            delete newAttendance[dateKey]; // remove status
        } else {
            newAttendance[dateKey] = 'present';
        }

        setAttendance(newAttendance);
        localStorage.setItem('userAttendance', JSON.stringify(newAttendance));
    };

    return (
        <div className="flex h-full">
            <main className="flex-grow flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark">
                {/* Header Profile */}
                <header className="relative h-64 md:h-80 shrink-0">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent"></div>

                    <div className="max-w-screen-2xl mx-auto flex justify-between items-end h-full px-6 md:px-12 pb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-4xl font-extrabold flex items-center gap-3">
                                    Perfil y Ajustes
                                    {role === 'admin' && (
                                        <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full border border-primary/30 font-black tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            Creador
                                        </span>
                                    )}
                                </h2>
                                <p className="text-slate-500 mt-2 italic font-medium">Gestiona tus datos físicos y preferencias. <span className="text-primary/70 ml-2 font-bold not-italic underline decoration-primary/30 underline-offset-4">(Guardado automático activado)</span></p>
                            </div>
                        </div>
                        <button
                            id="save-btn"
                            onClick={handleSave}
                            className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-lg">sync</span> Actualizar Historial
                        </button>
                    </div>
                </header>
                {/* Main Content */}
                <div className="max-w-screen-2xl mx-auto w-full px-6 md:px-12 py-10 space-y-12">

                    {/* Editable User Header */}
                    <section className="flex flex-col md:flex-row items-center gap-8 p-8 bg-card-light dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl shadow-sm">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-border-dark group-hover:border-primary transition-colors">
                                <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="flex-1 w-full text-center md:text-left space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-background-dark/50 border-none rounded-xl px-4 py-3 text-xl font-bold focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Objetivo Actual</label>
                                    <div className="relative group/goal">
                                        <div className="p-3 bg-slate-100 dark:bg-background-dark/50 rounded-xl flex items-center gap-2 border border-transparent hover:border-slate-200 dark:hover:border-border-dark transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-primary group-hover/goal:scale-110 transition-transform">flag</span>
                                            <select
                                                value={goal}
                                                onChange={(e) => setGoal(e.target.value)}
                                                className="bg-transparent border-none appearance-none font-bold text-lg text-slate-700 dark:text-slate-300 w-full focus:ring-0 cursor-pointer"
                                            >
                                                <option value="" disabled>Seleccionar...</option>
                                                <option value="gain_muscle">Ganar Músculo</option>
                                                <option value="lose_fat">Perder Grasa</option>
                                                <option value="gain_fat">Ganar Peso</option>
                                                <option value="gain_endurance">Ganar Resistencia</option>
                                            </select>
                                            <span className="material-symbols-outlined text-slate-400 text-sm ml-auto opacity-0 group-hover/goal:opacity-100 transition-opacity pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Instagram</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">@</span>
                                        <input
                                            type="text"
                                            value={instagram.replace('@', '')}
                                            onChange={(e) => setInstagram('@' + e.target.value.replace('@', ''))}
                                            className="w-full bg-slate-100 dark:bg-background-dark/50 border-none rounded-xl pl-10 pr-4 py-3 text-lg font-medium focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-300"
                                            placeholder="usuario"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Teléfono / WhatsApp</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                                            <span className="material-symbols-outlined text-lg">call</span>
                                        </span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-slate-100 dark:bg-background-dark/50 border-none rounded-xl pl-12 pr-4 py-3 text-lg font-medium focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-300"
                                            placeholder="+34 ..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">monitoring</span> Datos Físicos Editables</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Weight Input */}
                            <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl flex justify-between items-center hover:border-primary/50 transition-colors group focus-within:ring-2 focus-within:ring-primary/20">
                                <div className="flex flex-col">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Peso Actual</p>
                                    <div className="flex items-baseline gap-1">
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="bg-transparent border-none p-0 w-24 text-4xl font-black text-slate-900 dark:text-white focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-primary text-xl font-bold">kg</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-4xl opacity-10 group-hover:opacity-30 transition-opacity">scale</span>
                            </div>

                            {/* Height Input */}
                            <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl flex justify-between items-center hover:border-primary/50 transition-colors group focus-within:ring-2 focus-within:ring-primary/20">
                                <div className="flex flex-col">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Altura</p>
                                    <div className="flex items-baseline gap-1">
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            className="bg-transparent border-none p-0 w-24 text-4xl font-black text-slate-900 dark:text-white focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <span className="text-primary text-xl font-bold">cm</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-4xl opacity-10 group-hover:opacity-30 transition-opacity">straighten</span>
                            </div>
                        </div>
                    </section>

                    {/* New Calendar and Chart Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {/* Attendance Calendar */}
                            <AttendanceCalendar
                                attendance={attendance}
                                onToggleDay={handleToggleAttendance}
                                goal={goal} // Pass the user goal
                            />

                            {/* Weight History Chart */}
                            <EvolutionChart data={weightHistory} />
                        </div>
                    </section>



                    <section>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">accessibility_new</span> Accesibilidad & Tema</h3>
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-border-dark">

                            <div className="p-6 flex justify-between items-center">
                                <div><p className="font-bold">Modo Oscuro</p><p className="text-sm text-slate-500">Cambia entre tema claro y oscuro.</p></div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-primary' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 size-5 bg-white rounded-full transition-all duration-300 shadow-sm ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </section>
                    <div className="pt-10 border-t border-slate-200 dark:border-border-dark flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                                    logout();
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Cerrar Sesión
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y borrará todos tus datos.')) {
                                    deleteAccount();
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-500/10 text-rose-500 font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                        >
                            <span className="material-symbols-outlined">delete_forever</span>
                            Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default ProfileSettings;