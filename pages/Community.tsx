import React, { useState, useRef, useEffect } from 'react';
import { IMAGES } from '../constants';
import { useNavigate } from 'react-router-dom';

const Community = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            navigate('/onboarding');
        }
    }, [navigate]);

    // Current logged in user data for real-time updates
    const [currentUser, setCurrentUser] = useState({
        name: localStorage.getItem('userName') || 'Marvin De Araujo',
        avatar: localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR,
        instagram: localStorage.getItem('userInstagram') || '@fitmarvin_dev'
    });

    // Listen for profile updates
    useEffect(() => {
        const handleUserUpdate = () => {
            setCurrentUser({
                name: localStorage.getItem('userName') || 'Marvin De Araujo',
                avatar: localStorage.getItem('userAvatar') || IMAGES.USER_AVATAR,
                instagram: localStorage.getItem('userInstagram') || '@fitmarvin_dev'
            });
        };
        window.addEventListener('user-update', handleUserUpdate);
        return () => window.removeEventListener('user-update', handleUserUpdate);
    }, []);

    const [postText, setPostText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial posts data from localStorage or empty, limited to 10
    const [posts, setPosts] = useState<any[]>(() => {
        try {
            const stored = localStorage.getItem('community_posts');
            if (stored) {
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
            }
        } catch (e) {
            console.error("Storage load error:", e);
        }
        return [];
    });

    // Safe storage utility: returns true if success, false if quota error
    const attemptSave = (data: any) => {
        try {
            localStorage.setItem('community_posts', JSON.stringify(data));
            return true;
        } catch (e: any) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                return false;
            }
            console.error("Storage error:", e);
            return false;
        }
    };

    // Auto-sync limited posts to storage
    useEffect(() => {
        if (posts.length > 0) {
            attemptSave(posts.slice(0, 10));
        }
    }, [posts]);

    // Handle cross-tab updates for posts
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'community_posts') {
                try {
                    const newVal = JSON.parse(e.newValue || '[]');
                    setPosts(Array.isArray(newVal) ? newVal.slice(0, 10) : []);
                } catch (err) {
                    console.error("Storage sync error:", err);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    const handlePost = async () => {
        console.log("HandlePost triggered", { postText, hasFile: !!selectedFile, isPublishing });
        if ((!postText.trim() && !selectedFile) || isPublishing) return;

        // Check if user already has 2 posts with images
        if (selectedFile) {
            const userImagePosts = posts.filter(p => p.user === currentUser.name && p.image);
            if (userImagePosts.length >= 2) {
                alert("Cada usuario puede tener un máximo de 2 fotos. Por favor, elimina una de tus fotos antiguas antes de subir una nueva.");
                return;
            }
        }

        setIsPublishing(true);
        let processedImage = null;

        try {
            if (selectedFile) {
                processedImage = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 450;
                            const MAX_HEIGHT = 450;
                            let width = img.width;
                            let height = img.height;
                            if (width > height) {
                                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                            } else {
                                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', 0.4));
                        };
                        img.onerror = () => reject(new Error("Error al procesar la imagen."));
                        img.src = e.target?.result as string;
                    };
                    reader.onerror = () => reject(new Error("Error al leer el archivo."));
                    reader.readAsDataURL(selectedFile);
                });
            }

            const newPost = {
                id: Date.now(),
                user: currentUser.name,
                time: "Hoy, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: postText.trim(),
                likes: 0,
                image: processedImage,
                avatar: currentUser.avatar,
                goal: localStorage.getItem('userGoal') || 'Fitness',
                instagram: currentUser.instagram
            };

            let updatedPosts = [newPost, ...posts].slice(0, 10);

            // Attempt 1: Normal save
            let success = attemptSave(updatedPosts);

            // Attempt 2: If failed, try saving current post WITHOUT image
            if (!success && processedImage) {
                console.warn("Quota full, trying without current image...");
                const fallbackPost = { ...newPost, image: null };
                updatedPosts = [fallbackPost, ...posts].slice(0, 10);
                success = attemptSave(updatedPosts);
                if (success) alert("Espacio lleno: Se publicó solo el texto.");
            }

            // Attempt 3: If still failed, clear images from older posts
            if (!success) {
                console.warn("Quota still full, stripping all images...");
                const strippedPosts = updatedPosts.map(p => ({ ...p, image: null }));
                success = attemptSave(strippedPosts);
                updatedPosts = strippedPosts;
                if (success) alert("Memoria llena: Hemos optimizado el muro eliminando fotos antiguas.");
            }

            if (success) {
                setPosts(updatedPosts);
                window.dispatchEvent(new Event('community-update'));
                setPostText('');
                setSelectedFile(null);
                setPreview(null);
            } else {
                throw new Error("El navegador no permite guardar más datos. Intenta borrar el historial.");
            }

        } catch (err: any) {
            console.error("Critical Publish Error:", err);
            alert(err.message || "Error al publicar.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleLike = (id: number) => {
        const updated = posts.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p);
        setPosts(updated);
        try {
            localStorage.setItem('community_posts', JSON.stringify(updated));
        } catch (e) {
            console.error("Like storage error:", e);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
            const updated = posts.filter(p => p.id !== id);
            setPosts(updated);
            localStorage.setItem('community_posts', JSON.stringify(updated));
            window.dispatchEvent(new Event('community-update'));
        }
    };

    return (
        <div className="flex h-full">
            <main className="flex-grow flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark px-6 md:px-12 py-10">
                <div className="max-w-screen-2xl mx-auto w-full space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Mis Logros Recientes</h2>
                        {/* Editable Achievements Area - Simulated for now */}
                        <div className="grid grid-cols-2 md://grid-cols-4 gap-4">
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
                            {/* Add Achievement Button (Visual only) */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 dark:border-border-dark p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-400"
                            >
                                <span className="material-symbols-outlined text-3xl mb-2">add_a_photo</span>
                                <span className="font-bold text-xs">Subir Foto</span>
                            </button>
                        </div>
                    </section>
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">forum</span>
                                <h2 className="text-2xl font-bold">Muro de Comunidad</h2>
                            </div>
                            <button
                                onClick={() => {
                                    if (confirm("¿Quieres limpiar la memoria de fotos antiguas para liberar espacio?")) {
                                        localStorage.removeItem('community_posts');
                                        setPosts([]);
                                        window.dispatchEvent(new Event('community-update'));
                                    }
                                }}
                                className="text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 bg-slate-100 dark:bg-white/5 py-1 px-3 rounded-full"
                            >
                                <span className="material-symbols-outlined text-xs">delete_sweep</span>
                                Limpiar Memoria
                            </button>
                        </div>

                        {/* Create Post Area */}
                        <div className="bg-card-light dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 mb-6 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 placeholder:text-slate-500 text-lg resize-none mb-4 outline-none"
                                placeholder="¿Cómo vas hoy? Comparte tus videos o fotos..."
                                rows={2}
                            ></textarea>

                            {/* Image Preview */}
                            {preview && (
                                <div className="mb-4 relative inline-block">
                                    <img src={preview} alt="Preview" className="h-32 rounded-xl object-cover border border-slate-200 dark:border-border-dark" />
                                    <button
                                        onClick={() => { setPreview(null); setSelectedFile(null); }}
                                        className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-md hover:bg-black/80"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-border-dark">
                                <div className="flex gap-2 text-slate-400">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="hover:bg-slate-100 dark:hover:bg-border-dark p-2 rounded-full transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                                        <span className="text-xs font-bold text-slate-500">Foto/Video</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,video/*"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={(!postText.trim() && !selectedFile) || isPublishing}
                                    className="bg-primary px-6 py-2 rounded-lg text-black font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isPublishing ? (
                                        <>
                                            <span className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                                            Publicando...
                                        </>
                                    ) : (
                                        'Publicar'
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.id} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300 group/post">
                                        <div className="flex justify-between items-start mb-4">
                                            <div
                                                className="flex gap-4 cursor-pointer group/author"
                                                onClick={() => setSelectedUserProfile(post)}
                                            >
                                                <div
                                                    className="size-10 rounded-full bg-slate-200 bg-cover bg-center border border-slate-200 dark:border-white/10 group-hover/author:ring-2 group-hover/author:ring-primary transition-all"
                                                    style={{ backgroundImage: `url('${(post.user === currentUser.name) ? currentUser.avatar : (post.avatar || IMAGES.USER_AVATAR)}')` }}
                                                ></div>
                                                <div>
                                                    <p className="font-bold text-sm group-hover/author:text-primary transition-colors">{post.user}</p>
                                                    <p className="text-xs text-slate-500">{post.time}</p>
                                                </div>
                                            </div>
                                            {(post.user === currentUser.name) && (
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover/post:opacity-100"
                                                    title="Excluir publicación"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            )}
                                        </div>

                                        {post.text && <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{post.text}</p>}

                                        {post.image && (
                                            <div className="mb-4 rounded-xl overflow-hidden border border-slate-100 dark:border-border-dark">
                                                <img src={post.image} alt="Post content" className="w-full max-h-96 object-cover" />
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleLike(post.id)}
                                            className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors group"
                                        >
                                            <span className="material-symbols-outlined group-hover:scale-125 transition-transform group-active:scale-95">celebration</span>
                                            Aplaudir ({post.likes || 0})
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white/50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">auto_awesome</span>
                                    <p className="text-slate-500 font-bold">¡El muro está listo para vuestras historias!</p>
                                    <p className="text-xs text-slate-400 mt-1">Sé el primero en saludar a la familia.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div >
            </main >

            {/* Profile Modal */}
            {selectedUserProfile && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedUserProfile(null)}
                >
                    <div
                        className="bg-white dark:bg-surface-dark max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-border-dark"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header/Cover */}
                        <div className="h-24 bg-gradient-to-r from-primary/40 to-primary/10 relative">
                            <button
                                onClick={() => setSelectedUserProfile(null)}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-8 pb-8 -mt-12 text-center">
                            <div
                                className="size-24 rounded-3xl mx-auto bg-white dark:bg-surface-dark p-1 shadow-xl mb-4"
                            >
                                <div
                                    className="w-full h-full rounded-2xl bg-slate-200 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${(selectedUserProfile.user === currentUser.name || selectedUserProfile.user === 'Marvin De Araujo') ? currentUser.avatar : selectedUserProfile.avatar}')` }}
                                ></div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                                {selectedUserProfile.user === 'Marvin De Araujo' ? currentUser.name : selectedUserProfile.user}
                            </h3>
                            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">
                                {selectedUserProfile.goal || "Entusiasta Fitness"}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Racha</p>
                                    <p className="text-xl font-black">12 Días</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nivel</p>
                                    <p className="text-xl font-black">Pro Member</p>
                                </div>
                            </div>

                            {/* Instagram Social Action */}
                            <a
                                href={selectedUserProfile.user === 'Marvin De Araujo' || selectedUserProfile.user === currentUser.name ? "https://www.instagram.com/fitmarvin_dev/" : `https://instagram.com/${(selectedUserProfile.instagram || '@fitmarvin_dev').replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-[#E1306C] text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-pink-500/20"
                            >
                                <span className="material-symbols-outlined">share</span>
                                Seguir en Instagram
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Community;