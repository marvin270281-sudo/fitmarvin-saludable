import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

// --- DATA TYPES & GENERATION ---
interface DayPlan {
    day: number;
    breakfast: string;
    lunch: string;
    dinner: string;
}

// Helper to get recipe details based on meal name keywords
const getRecipeDetails = (mealName: string): { img: string, steps: string[] } => {
    const lower = mealName.toLowerCase();

    // Images (Unsplash high quality food shots)
    const IMAGES = {
        eggs: 'https://images.unsplash.com/photo-1528607929212-f6332401343c?auto=format&fit=crop&q=80&w=800',
        chicken: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800',
        fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
        salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
        oats: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&q=80&w=800',
        pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800',
        pancakes: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=800',
        rice: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800',
        default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
    };

    if (lower.includes('huevo') || lower.includes('tortilla') || lower.includes('clara')) {
        return {
            img: IMAGES.eggs,
            steps: [
                'Calienta una sartén antiadherente con un poco de aceite en spray.',
                'Bate los huevos o claras con una pizca de sal y pimienta.',
                'Vierte en la sartén y cocina a fuego medio.',
                'Si es tortilla, voltea cuando cuaje; si son revueltos, remueve suavemente.',
                'Sirve caliente acompañado de la guarnición indicada.'
            ]
        };
    }
    if (lower.includes('pollo') || lower.includes('pavo') || lower.includes('ternera') || lower.includes('hamburguesa')) {
        return {
            img: IMAGES.chicken,
            steps: [
                'Sazona la carne con sal, pimienta, ajo en polvo y hierbas al gusto.',
                'Calienta la plancha o sartén a fuego alto para sellar la carne.',
                'Cocina 3-5 minutos por lado (dependiendo del grosor) hasta que esté dorada y cocida por dentro.',
                'Deja reposar 2 minutos antes de cortar para mantener los jugos.',
                'Acompaña con las verduras o carbohidratos sugeridos.'
            ]
        };
    }
    if (lower.includes('pescado') || lower.includes('atún') || lower.includes('salmón') || lower.includes('merluza') || lower.includes('lubina')) {
        return {
            img: IMAGES.fish,
            steps: [
                'Seca bien el pescado con papel de cocina.',
                'Sazona con sal, un chorrito de limón y eneldo o perejil.',
                'Cocina a la plancha a fuego medio-alto, primero por el lado de la piel si tiene.',
                'Evita cocinarlo en exceso para que no quede seco (el pescado se cocina rápido).',
                'Sirve inmediatamente.'
            ]
        };
    }
    if (lower.includes('ensalada') || lower.includes('aguacate')) {
        return {
            img: IMAGES.salad,
            steps: [
                'Lava y desinfecta bien todas las verduras frescas.',
                'Corta los ingredientes en trozos de tamaño similar (un bocado).',
                'Prepara una vinagreta simple con aceite de oliva, vinagre y sal.',
                'Mezcla todo en un bol justo antes de comer para que no se ablande.',
                'Añade la proteína (atún, pollo, etc.) al final.'
            ]
        };
    }
    if (lower.includes('avena') || lower.includes('gachas') || lower.includes('yogur')) {
        return {
            img: IMAGES.oats,
            steps: [
                'Si es avena cocida: pon la avena con agua o leche en un cazo.',
                'Cocina a fuego medio removiendo constantemente hasta que espese.',
                'Endulza con un poco de edulcorante o miel si lo permite tu dieta.',
                'Sirve en un bol y añade los toppings (frutas, nueces) por encima.'
            ]
        };
    }
    if (lower.includes('tortitas')) {
        return {
            img: IMAGES.pancakes,
            steps: [
                'Mezcla los ingredientes de la masa (avena, huevo, etc.) en una licuadora.',
                'Calienta una sartén antiadherente y engrasa ligeramente.',
                'Vierte porciones de masa y cocina hasta que salgan burbujitas en la superficie.',
                'Voltea y cocina 1 minuto más por el otro lado.',
                'Apila y sirve caliente.'
            ]
        };
    }
    if (lower.includes('pasta') || lower.includes('arro') || lower.includes('quinoa') || lower.includes('lentejas')) {
        return {
            img: lower.includes('pasta') ? IMAGES.pasta : IMAGES.rice,
            steps: [
                'Pon agua a hervir con una pizca de sal.',
                'Añade el cereal/legumbre y cocina el tiempo indicado en el paquete.',
                'Escurre bien el agua.',
                'Mezcla con la salsa o ingredientes acompañantes en la misma olla caliente.',
                'Sirve la porción adecuada según tus macros.'
            ]
        };
    }

    return {
        img: IMAGES.default,
        steps: [
            'Lava y corta los ingredientes frescos.',
            'Cocina la proteína a la plancha, horno o vapor según prefieras.',
            'Prepara los carbohidratos (cocer arroz/pasta) aparte.',
            'Junta todos los elementos en tu plato de manera ordenada.',
            'Sazona con especias naturales y evita el exceso de sal.'
        ]
    };
};

const generatePlan = (type: 'lose' | 'gain'): DayPlan[] => {
    const menus = type === 'lose'
        ? [
            { b: 'Tortilla de claras (4) y espinacas', l: 'Pechuga de pollo (200g) con brócoli', d: 'Ensalada de atún y aguacate' },
            { b: 'Avena cocida con frutos rojos', l: 'Pavo al horno con batata asada', d: 'Crema de calabaza y merluza al vapor' },
            { b: 'Tostada integral con aguacate', l: 'Lentejas estofadas con verduras', d: 'Salmón al vapor con espárragos' },
            { b: 'Yogur griego con nueces', l: 'Ternera magra con arroz integral', d: 'Revuelto de champiñones y gambas' },
            { b: 'Batido de proteína y plátano', l: 'Ensalada de quinoa y pollo', d: 'Lubina al horno con pimientos' },
            { b: 'Tortitas de avena fit', l: 'Hamburguesa de pavo casera', d: 'Ceviche de pescado blanco' },
            { b: 'Huevos revueltos con tomate', l: 'Pasta integral con atún natural', d: 'Pollo al limón con ensalada verde' },
        ]
        : [
            { b: '4 Huevos revueltos con tostadas', l: 'Pasta boloñesa con carne magra', d: 'Salmón con patata asada y aceite' },
            { b: 'Batido de avena, plátano y crema cacahuete', l: 'Arroz con pollo y medio aguacate', d: 'Tortilla de patata y atún' },
            { b: 'Tortitas de avena y miel', l: 'Estofado de ternera con patatas', d: 'Merluza rebozada con arroz frito' },
            { b: 'Sandwich de pavo y queso XXL', l: 'Lentejas con chorizo y arroz', d: 'Pizza casera de pollo y queso' },
            { b: 'Gachas de avena con proteína whey', l: 'Burritos de carne y frijoles', d: 'Hamburguesa de ternera completa' },
            { b: 'Tostadas francesas proteicas', l: 'Pollo al curry con arroz basmati', d: 'Lasagna de calabacín y carne' },
            { b: 'Huevos fritos con bacon de pavo', l: 'Fideuá de marisco', d: 'Bocadillo de lomo y queso' },
        ];

    const days: DayPlan[] = [];
    // UPDATED: Loop to 31 days
    for (let i = 1; i <= 31; i++) {
        const menu = menus[(i - 1) % menus.length];
        days.push({
            day: i,
            breakfast: menu.b,
            lunch: menu.l,
            dinner: menu.d
        });
    }
    return days;
};

const PLAN_DATA = {
    lose: generatePlan('lose'),
    gain: generatePlan('gain')
};

const NutritionPlan = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [goal, setGoal] = useState<'lose' | 'gain'>('lose');
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // RECIPE MODAL STATE
    const [selectedRecipe, setSelectedRecipe] = useState<{ title: string, img: string, steps: string[] } | null>(null);

    // SYNC WITH PROFILE: Get weight from localStorage
    const [weight, setWeight] = useState(() => {
        const saved = localStorage.getItem('userWeight');
        return saved ? parseFloat(saved) : 78.5;
    });

    // REAL DATE LOGIC: Get actual current day
    const [currentDay, setCurrentDay] = useState(1);

    // FAVORITES LOGIC
    const [favorites, setFavorites] = useState<number[]>(() => {
        const saved = localStorage.getItem('nutritionFavorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            navigate('/onboarding');
            return;
        }
        setCurrentDay(new Date().getDate());
    }, [navigate]);

    // Save favorites on change
    useEffect(() => {
        localStorage.setItem('nutritionFavorites', JSON.stringify(favorites));
    }, [favorites]);

    // Update weight if localStorage changes (optional, but good for sync)
    useEffect(() => {
        const saved = localStorage.getItem('userWeight');
        if (saved) setWeight(parseFloat(saved));
    }, []);

    const toggleFavorite = (dayId: number) => {
        setFavorites(prev => {
            if (prev.includes(dayId)) return prev.filter(id => id !== dayId);
            return [...prev, dayId];
        });
    };

    const handleUpdateWeight = () => {
        setIsUpdating(true);
        setTimeout(() => {
            const change = Math.random() > 0.5 ? -0.2 : 0.1;
            const newWeight = Number((weight + change).toFixed(1));
            setWeight(newWeight);
            localStorage.setItem('userWeight', newWeight.toString());
            setIsUpdating(false);
            alert("¡Peso actualizado correctamente!");
        }, 800);
    };

    const handleMealClick = (mealName: string) => {
        const details = getRecipeDetails(mealName);
        setSelectedRecipe({ title: mealName, ...details });
    };

    const filteredPlan = useMemo(() => {
        const currentPlan = PLAN_DATA[goal];
        if (!searchTerm) return currentPlan;
        const lowerTerm = searchTerm.toLowerCase();
        return currentPlan.filter(day =>
            day.day.toString().includes(lowerTerm) ||
            day.breakfast.toLowerCase().includes(lowerTerm) ||
            day.lunch.toLowerCase().includes(lowerTerm) ||
            day.dinner.toLowerCase().includes(lowerTerm)
        );
    }, [goal, searchTerm]);

    return (
        <div className="flex h-full">
            <main className="flex-grow flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
                <div className="flex-grow overflow-y-auto custom-scrollbar px-6 md:px-12 py-10 max-w-screen-2xl mx-auto w-full">
                    <div className="w-full">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">Plan Nutricional</h1>
                                <p className="text-slate-500 text-lg max-w-xl">
                                    Tu hoja de ruta para {goal === 'lose' ? 'definición máxima' : 'volumen limpio'}.
                                    <span className="block text-primary text-sm font-bold mt-2">✨ Tip: Haz clic en cualquier comida para ver cómo prepararla.</span>
                                </p>
                            </div>
                            <div className="flex h-12 bg-card-light dark:bg-surface-dark p-1 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
                                <button
                                    onClick={() => setGoal('lose')}
                                    className={`px-6 rounded-lg font-bold text-sm uppercase transition-all ${goal === 'lose' ? 'bg-primary text-black shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Perder Peso
                                </button>
                                <button
                                    onClick={() => setGoal('gain')}
                                    className={`px-6 rounded-lg font-bold text-sm uppercase transition-all ${goal === 'gain' ? 'bg-primary text-black shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Ganar Masa
                                </button>
                            </div>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                            <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl shadow-sm">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Progreso ({currentDay}/31)</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-3xl font-black">{Math.min(currentDay, 31)}</p>
                                    <span className="text-sm font-bold text-slate-400 mb-1">días</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-border-dark h-1.5 rounded-full mt-4 overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(Math.min(currentDay, 31) / 31) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="p-6 bg-primary text-black rounded-xl relative overflow-hidden group shadow-lg shadow-primary/20">
                                <p className="text-black/60 text-xs font-bold uppercase mb-2">Peso Actual (Perfil)</p>
                                <p className="text-3xl font-black flex items-center gap-2">
                                    {weight} kg
                                    {isUpdating && <span className="material-symbols-outlined animate-spin text-lg">sync</span>}
                                </p>
                                <button
                                    onClick={handleUpdateWeight}
                                    disabled={isUpdating}
                                    className="mt-4 w-full py-2 bg-black text-primary text-[10px] font-black uppercase rounded hover:bg-black/80 transition-colors disabled:opacity-70"
                                >
                                    {isUpdating ? 'Actualizando...' : 'Actualizar'}
                                </button>
                            </div>
                            <div className="p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl md:col-span-2 shadow-sm">
                                <p className="text-slate-500 text-xs font-bold uppercase mb-2">Macros Diarios Requeridos</p>
                                <div className="flex gap-4 items-center h-full justify-around">
                                    <div className="text-center"><p className="font-bold text-2xl text-slate-900 dark:text-white">{goal === 'lose' ? '185' : '220'}g</p><p className="text-[10px] uppercase text-slate-500 font-bold">Proteína</p></div>
                                    <div className="w-px h-10 bg-slate-200 dark:bg-border-dark"></div>
                                    <div className="text-center"><p className="font-bold text-2xl text-slate-900 dark:text-white">{goal === 'lose' ? '210' : '350'}g</p><p className="text-[10px] uppercase text-slate-500 font-bold">Carbos</p></div>
                                    <div className="w-px h-10 bg-slate-200 dark:bg-border-dark"></div>
                                    <div className="text-center"><p className="font-bold text-2xl text-slate-900 dark:text-white">{goal === 'lose' ? '65' : '80'}g</p><p className="text-[10px] uppercase text-slate-500 font-bold">Grasas</p></div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                Calendario Mensual (31 Días)
                            </h2>
                        </div>

                        {filteredPlan.length === 0 ? (
                            <div className="text-center py-20 opacity-50 bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-border-dark">
                                <span className="material-symbols-outlined text-6xl mb-4 text-slate-400">no_food</span>
                                <p className="text-xl text-slate-500">No se encontraron comidas.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                                {filteredPlan.map((plan) => {
                                    const isToday = plan.day === currentDay;
                                    const isFav = favorites.includes(plan.day);

                                    return (
                                        <div
                                            key={plan.day}
                                            className={`group rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl relative ${isToday
                                                ? 'bg-white dark:bg-surface-dark border-primary ring-2 ring-primary shadow-lg shadow-primary/10'
                                                : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-border-dark hover:border-primary/50'
                                                }`}
                                        >
                                            {isToday && (
                                                <div className="absolute top-0 left-0 bg-primary text-black text-[10px] font-black uppercase px-3 py-1 rounded-br-xl z-10 shadow-sm flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">today</span>
                                                    HOY
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.day); }}
                                                className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-20 group/fav"
                                            >
                                                <span className={`material-symbols-outlined text-2xl transition-all ${isFav ? 'text-yellow-400 fill-current' : 'text-slate-300 group-hover/fav:text-yellow-400'}`}>
                                                    star
                                                </span>
                                            </button>

                                            <div className="flex items-center gap-3 mb-6 mt-4">
                                                <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${isToday ? 'bg-primary text-black' : 'bg-slate-100 dark:bg-black/30 text-slate-500'
                                                    }`}>
                                                    {plan.day}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-none">Día {plan.day}</h3>
                                                    {isToday && <p className="text-xs font-bold text-primary uppercase tracking-wider mt-1 animate-pulse">En curso</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div
                                                    onClick={() => handleMealClick(plan.breakfast)}
                                                    className="flex gap-4 items-start p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer group/meal"
                                                >
                                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400 shrink-0 group-hover/meal:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-lg">wb_sunny</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Desayuno</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover/meal:text-primary transition-colors">{plan.breakfast}</p>
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => handleMealClick(plan.lunch)}
                                                    className="flex gap-4 items-start p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer group/meal"
                                                >
                                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400 shrink-0 group-hover/meal:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-lg">restaurant</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Almuerzo</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover/meal:text-primary transition-colors">{plan.lunch}</p>
                                                    </div>
                                                </div>

                                                <div
                                                    onClick={() => handleMealClick(plan.dinner)}
                                                    className="flex gap-4 items-start p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer group/meal"
                                                >
                                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 shrink-0 group-hover/meal:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-lg">nights_stay</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cena</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover/meal:text-primary transition-colors">{plan.dinner}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RECIPE MODAL */}
                {selectedRecipe && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedRecipe(null)}>
                        <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>

                            {/* HEADER - TEXT ONLY */}
                            <div className="p-6 pb-2 flex justify-between items-start gap-4">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight pr-4">{selectedRecipe.title}</h3>
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-2 rounded-full transition-colors shrink-0"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>

                            <div className="p-6 pt-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-2 mb-4 mt-2 text-primary font-bold uppercase tracking-widest text-[10px] bg-primary/10 w-fit px-3 py-1.5 rounded-lg">
                                    <span className="material-symbols-outlined text-sm">skillet</span>
                                    Preparación
                                </div>
                                <ol className="space-y-4 border-l-2 border-slate-100 dark:border-white/10 ml-1.5 pl-4">
                                    {selectedRecipe.steps.map((step, i) => (
                                        <li key={i} className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed relative">
                                            <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-surface-dark border-[3px] border-primary box-border"></span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                                <div className="mt-8">
                                    <button
                                        onClick={() => setSelectedRecipe(null)}
                                        className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NutritionPlan;