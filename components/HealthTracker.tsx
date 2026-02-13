import React, { useState, useEffect } from 'react';

interface Medication {
    id: string;
    name: string;
    quantity: string;
    time: string;
    frequency: string;
}

const HealthTracker = () => {
    const [meds, setMeds] = useState<Medication[]>(() => {
        const saved = localStorage.getItem('health_meds');
        return saved ? JSON.parse(saved) : [];
    });
    const [hydration, setHydration] = useState(() => {
        const saved = localStorage.getItem('health_hydration');
        return saved ? parseInt(saved) : 0;
    });

    const [newMed, setNewMed] = useState({ name: '', quantity: '', time: '', frequency: '' });
    const [showAddMed, setShowAddMed] = useState(false);

    useEffect(() => {
        localStorage.setItem('health_meds', JSON.stringify(meds));
    }, [meds]);

    useEffect(() => {
        localStorage.setItem('health_hydration', hydration.toString());
    }, [hydration]);

    const addMedication = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMed.name) return;
        const med: Medication = {
            id: Date.now().toString(),
            ...newMed
        };
        setMeds([...meds, med]);
        setNewMed({ name: '', quantity: '', time: '', frequency: '' });
        setShowAddMed(false);
    };

    const removeMed = (id: string) => {
        setMeds(meds.filter(m => m.id !== id));
    };

    return (
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-6 shadow-sm animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Hydration Section */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                            <span className="material-symbols-outlined text-blue-500">water_drop</span>
                            Control de Hidratación
                        </h3>
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                            {hydration} Vasos
                        </span>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                        <button
                            onClick={() => setHydration(prev => Math.max(0, prev - 1))}
                            className="size-10 rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-400">remove</span>
                        </button>
                        <div className="flex-1 flex justify-center gap-1">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-8 w-4 rounded-sm transition-all ${i < hydration ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200 dark:bg-white/10'}`}
                                ></div>
                            ))}
                        </div>
                        <button
                            onClick={() => setHydration(prev => prev + 1)}
                            className="size-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </div>

                {/* Medication Section */}
                <div className="flex-[1.5]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                            <span className="material-symbols-outlined text-rose-500">pill</span>
                            Control de Medicación
                        </h3>
                        <button
                            onClick={() => setShowAddMed(!showAddMed)}
                            className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                            <span className="material-symbols-outlined text-sm">{showAddMed ? 'close' : 'add_circle'}</span>
                            {showAddMed ? 'Cancelar' : 'Añadir'}
                        </button>
                    </div>

                    {showAddMed && (
                        <form onSubmit={addMedication} className="mb-4 grid grid-cols-2 gap-2 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-primary/20 animate-in slide-in-from-top-2">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newMed.name}
                                onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                                className="col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Cantidad"
                                value={newMed.quantity}
                                onChange={e => setNewMed({ ...newMed, quantity: e.target.value })}
                                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Horario (ej: 08:00)"
                                value={newMed.time}
                                onChange={e => setNewMed({ ...newMed, time: e.target.value })}
                                className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs"
                            />
                            <input
                                type="text"
                                placeholder="Cada cuánto (ej: 8h)"
                                value={newMed.frequency}
                                onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                                className="col-span-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs"
                            />
                            <button type="submit" className="col-span-2 py-2 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl">
                                Guardar Medicamento
                            </button>
                        </form>
                    )}

                    <div className="space-y-2">
                        {meds.length === 0 ? (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic text-center py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                No hay medicamentos registrados
                            </p>
                        ) : (
                            meds.map(med => (
                                <div key={med.id} className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/10 group">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">medical_services</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-white leading-none">{med.name}</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">
                                                {med.quantity} • {med.time} • Cada {med.frequency}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeMed(med.id)}
                                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
