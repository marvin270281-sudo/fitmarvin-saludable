import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { IMAGES } from '../constants';

const Community = () => {
    const [postText, setPostText] = useState('');
    const [posts, setPosts] = useState([
        { id: 1, user: "Carlos G.", time: "Hace 15 min", text: "¡Reto superado! Logré mis primeros 5km sin parar en menos de 28 minutos. 🏃‍♂️💨", likes: 24 }
    ]);

    const handlePost = () => {
        if (!postText.trim()) return;
        
        const newPost = {
            id: Date.now(),
            user: "Marvin R.",
            time: "Ahora mismo",
            text: postText,
            likes: 0
        };

        setPosts([newPost, ...posts]);
        setPostText('');
    };

    const handleLike = (id: number) => {
        setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-grow flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark p-8">
                <div className="max-w-4xl mx-auto w-full space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Mis Logros Recientes</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Madrugador", icon: "wb_sunny" },
                                { label: "7 Días Racha", icon: "local_fire_department" },
                                { label: "Meta Alcanzada", icon: "flag" },
                                { label: "Power Lifter", icon: "fitness_center" }
                            ].map((badge, idx) => (
                                <div key={idx} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-6 rounded-2xl flex flex-col items-center text-center hover:-translate-y-1 transition-transform shadow-sm hover:shadow-md cursor-default">
                                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                                    </div>
                                    <h3 className="font-bold text-sm">{badge.label}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary">forum</span>
                            <h2 className="text-2xl font-bold">Muro de Comunidad</h2>
                        </div>
                        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 mb-6 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <textarea 
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 placeholder:text-slate-500 text-lg resize-none mb-4 outline-none" 
                                placeholder="¿Cómo vas hoy, Marvin? Comparte tu progreso..."
                                rows={2}
                            ></textarea>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-border-dark">
                                <div className="flex gap-2 text-slate-400">
                                    <button className="hover:bg-slate-100 dark:hover:bg-border-dark p-2 rounded-full transition-colors"><span className="material-symbols-outlined">image</span></button>
                                    <button className="hover:bg-slate-100 dark:hover:bg-border-dark p-2 rounded-full transition-colors"><span className="material-symbols-outlined">mood</span></button>
                                </div>
                                <button 
                                    onClick={handlePost}
                                    disabled={!postText.trim()}
                                    className="bg-primary px-6 py-2 rounded-lg text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Compartir
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex gap-4 mb-4">
                                        <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center" style={{backgroundImage: `url('${IMAGES.COMMUNITY_AVATAR_1}')`}}></div>
                                        <div><p className="font-bold text-sm">{post.user}</p><p className="text-xs text-slate-500">{post.time}</p></div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.text}</p>
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors group"
                                    >
                                        <span className="material-symbols-outlined group-hover:scale-125 transition-transform group-active:scale-95">celebration</span> 
                                        Aplaudir ({post.likes})
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Community;