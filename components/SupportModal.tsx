import React, { useState } from 'react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const phone = "+34695756856";
    const igUrl = "https://www.instagram.com/marvin_dev2026/?hl=es-es";

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Banner */}
                <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/40 p-8 flex flex-col justify-end relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                    <h2 className="text-2xl font-black text-black leading-none">Apoya el Proyecto</h2>
                    <p className="text-black/70 text-xs font-bold uppercase tracking-widest mt-2">FitMarvin by Marcus De Araujo</p>
                </div>

                <div className="p-8">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
                        ¡Hola! Tu apoyo ayuda a mejorar esta aplicación, mantener los servidores y apoyar a mi familia. Cada granito de arena cuenta. 💪
                    </p>

                    <div className="space-y-4">
                        {/* Bizum Option */}
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                                    <span className="material-symbols-outlined text-base">payments</span>
                                    Bizum Directo
                                </span>
                                {copied && (
                                    <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full animate-bounce">
                                        ¡Copiado!
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-xl font-mono font-black text-slate-900 dark:text-white">{phone}</span>
                                <button
                                    onClick={handleCopy}
                                    className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm"
                                    title="Copiar número"
                                >
                                    <span className="material-symbols-outlined text-slate-500">content_copy</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Nombre: Marcus Vinicius De Araujo</p>
                        </div>

                        {/* Instagram Option */}
                        <a
                            href={igUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-2xl text-white group hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">mail</span>
                                <div className="text-left">
                                    <p className="text-sm font-black leading-none">Mensaje en Instagram</p>
                                    <p className="text-[10px] opacity-80 font-bold uppercase tracking-tight mt-1">@marvin_dev2026</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-xl">open_in_new</span>
                        </a>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 py-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm transition-colors"
                    >
                        Cerrar ventana
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
