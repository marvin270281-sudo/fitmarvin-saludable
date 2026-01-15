import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="max-w-xl w-full text-center mb-12">
                <div className="mb-4"><span className="text-primary text-xs font-bold uppercase tracking-widest">Paso 1 de 4</span></div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">¿Cuál es tu <span className="text-primary">objetivo</span> principal?</h1>
                <p className="text-slate-500 text-lg">Personalizaremos tu plan basándonos en tu meta.</p>
            </div>
            <div className="max-w-xl w-full space-y-4">
                {[
                    { title: "Perder Grasa", desc: "Enfócate en quemar calorías y definir.", icon: "local_fire_department" },
                    { title: "Ganar Músculo", desc: "Aumenta fuerza e hipertrofia.", icon: "fitness_center" },
                    { title: "Resistencia", desc: "Optimiza capacidad cardiovascular.", icon: "directions_run" }
                ].map((goal, i) => (
                    <label key={i} className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all cursor-pointer ${i === 0 ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-border-dark hover:border-primary/50'}`}>
                        <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">{goal.icon}</span>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-bold text-lg">{goal.title}</p>
                            <p className="text-sm text-slate-500">{goal.desc}</p>
                        </div>
                        <input type="radio" name="goal" defaultChecked={i===0} className="text-primary focus:ring-primary h-6 w-6 accent-primary" />
                    </label>
                ))}
            </div>
            <div className="max-w-xl w-full mt-12 space-y-4">
                <button onClick={() => navigate('/')} className="w-full bg-primary py-4 rounded-2xl text-black font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all">Siguiente</button>
                <button onClick={() => navigate('/')} className="w-full text-slate-500 font-bold text-sm hover:text-slate-700 dark:hover:text-slate-300">Saltar por ahora</button>
            </div>
        </div>
    );
};

export default Onboarding;
