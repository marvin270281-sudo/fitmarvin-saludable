import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = React.useState(0);
    const [role, setRole] = React.useState<'user' | 'admin' | null>(null);
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [selectedGoal, setSelectedGoal] = React.useState('');

    React.useEffect(() => {
        const user = localStorage.getItem('userName');
        if (user) {
            navigate('/');
        }
    }, [navigate]);

    const goals = [
        { id: 'gain_fat', label: 'Ganar Peso', icon: 'fastfood', color: 'text-orange-500' },
        { id: 'lose_fat', label: 'Perder Grasa', icon: 'local_fire_department', color: 'text-red-500' },
        { id: 'gain_muscle', label: 'Ganar Músculo', icon: 'fitness_center', color: 'text-purple-500' },
        { id: 'gain_endurance', label: 'Ganar Resistencia', icon: 'directions_run', color: 'text-blue-500' }
    ];

    const handleRoleSelect = (selectedRole: 'user' | 'admin') => {
        setRole(selectedRole);
        if (selectedRole === 'admin') {
            setName('MARVIN DE ARAUJO');
        }
        setStep(1);
    };

    const handleContinue = () => {
        if (role === 'admin') {
            if (password === 'admin270281') {
                setStep(2);
                setError('');
            } else {
                setError('Contraseña incorrecta');
            }
        } else if (role === 'user') {
            if (name.trim()) {
                setStep(2);
            }
        }
    };

    const handleFinish = (goalId: string) => {
        if (name.trim()) {
            localStorage.setItem('userName', name);
            localStorage.setItem('userGoal', goalId);
            localStorage.setItem('userRole', role || 'user');
            localStorage.setItem('isAdmin', role === 'admin' ? 'true' : 'false');

            // Dispatch event for instant updates
            window.dispatchEvent(new Event('user-update'));

            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: `url(${IMAGES.LOGO})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            ></div>

            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-background-dark/95"></div>

            <div className="max-w-xl w-full text-center mb-8 relative z-10">
                {step === 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">
                            Bienvenido a <span className="text-primary">FitMarvin</span>
                        </h1>
                        <p className="text-slate-400 text-lg mb-10 text-balance uppercase tracking-widest font-bold">Selecciona tu tipo de cuenta</p>

                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={() => handleRoleSelect('user')}
                                className="bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 p-8 rounded-3xl flex items-center justify-between transition-all group shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-primary/20 text-primary">
                                        <span className="material-symbols-outlined text-3xl">person</span>
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold uppercase tracking-tight">Usuario</h2>
                                        <p className="text-slate-500 text-sm">Entrena y sigue tu progreso</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">arrow_forward</span>
                            </button>

                            <button
                                onClick={() => handleRoleSelect('admin')}
                                className="bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 p-8 rounded-3xl flex items-center justify-between transition-all group shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-400">
                                        <span className="material-symbols-outlined text-3xl">shield_person</span>
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-bold uppercase tracking-tight">Administrador</h2>
                                        <p className="text-slate-500 text-sm">Gestiona la plataforma (Marvin)</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">lock</span>
                            </button>
                        </div>
                    </div>
                ) : step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-right duration-500">
                        <h1 className="text-3xl md:text-4xl font-black mb-4">
                            {role === 'admin' ? 'Hola Marvin, introduce tu ' : '¡Hola! '}
                            <span className="text-primary">{role === 'admin' ? 'Contraseña' : '¿Cómo te llamas?'}</span>
                        </h1>
                        <p className="text-slate-500 text-lg">{role === 'admin' ? 'Solo para el acceso del creador.' : 'Para dirigirnos a ti como te mereces.'}</p>

                        <div className="mt-8">
                            {role === 'admin' ? (
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                                    placeholder="Contraseña de admin..."
                                    className="w-full text-center text-3xl font-bold py-4 bg-transparent border-b-2 border-slate-200 focus:border-primary outline-none transition-colors placeholder:text-slate-700 text-white"
                                    autoFocus
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                                    placeholder="Escribe tu nombre..."
                                    className="w-full text-center text-3xl font-bold py-4 bg-transparent border-b-2 border-slate-200 focus:border-primary outline-none transition-colors placeholder:text-slate-700 text-white"
                                    autoFocus
                                />
                            )}
                            {error && <p className="text-red-500 mt-4 font-bold">{error}</p>}
                        </div>

                        <div className="mt-12 flex flex-col gap-4">
                            <button
                                onClick={handleContinue}
                                className={`w-full bg-primary py-4 rounded-2xl text-black font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all ${(role === 'admin' ? !password : !name.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={role === 'admin' ? !password : !name.trim()}
                            >
                                Continuar
                            </button>
                            <button
                                onClick={() => setStep(0)}
                                className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                Volver
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right duration-500">
                        <h1 className="text-3xl md:text-4xl font-black mb-4">
                            ¿Cuál es tu <span className="text-primary">objetivo principal</span>?
                        </h1>
                        <p className="text-slate-500 text-lg mb-8">Te ayudaremos a conseguirlo paso a paso.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goals.map((goal) => (
                                <button
                                    key={goal.id}
                                    onClick={() => handleFinish(goal.id)}
                                    className="bg-white/5 border border-white/10 hover:border-primary hover:bg-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 transition-all group"
                                >
                                    <div className={`p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform ${goal.color}`}>
                                        <span className="material-symbols-outlined text-3xl">{goal.icon}</span>
                                    </div>
                                    <span className="font-bold text-lg">{goal.label}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="mt-8 text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center justify-center gap-2 mx-auto"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Volver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
