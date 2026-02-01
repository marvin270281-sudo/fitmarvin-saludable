import React from 'react';
import { useMusic } from '../context/MusicContext';

const GlobalSpotifyPlayer = () => {
    const { isOpen, toggleOpen, playlistUrl } = useMusic();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            {/* 1. The Player Panel */}
            <div
                className={`
                    pointer-events-auto
                    w-80 bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden
                    transition-all duration-500 ease-out origin-bottom-right
                    ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-12 pointer-events-none'}
                `}
            >
                {/* Header/Grabber */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 animate-pulse">
                            <span className="material-symbols-outlined text-black text-sm font-black">equalizer</span>
                        </div>
                        <div>
                            <h3 className="font-black text-white text-[10px] uppercase tracking-widest leading-none">Spotify Radio</h3>
                            <p className="text-[#1DB954] text-[8px] font-bold uppercase tracking-tighter mt-1">Live Workout Flow</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleOpen}
                        className="size-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full transition-all group"
                        title="Ocultar"
                    >
                        <span className="material-symbols-outlined text-white/50 group-hover:text-white text-lg">expand_more</span>
                    </button>
                </div>

                {/* Spotify Embed */}
                <div className="h-[352px] bg-black">
                    <iframe
                        src={playlistUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify Player"
                        className="opacity-90 hover:opacity-100 transition-opacity"
                    ></iframe>
                </div>
            </div>

            {/* 2. Floating Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`
                    pointer-events-auto
                    size-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95
                    ${isOpen
                        ? 'bg-white text-black rotate-180 opacity-0 scale-50 pointer-events-none'
                        : 'bg-[#1DB954] text-black hover:shadow-[#1DB954]/40 scale-100 opacity-100'}
                    relative group
                `}
            >
                {/* Spotify Logo Icon logic */}
                <span className="material-symbols-outlined text-3xl font-black">music_note</span>

                {/* Visual Glow */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-[#1DB954] animate-ping opacity-20"></span>
                )}

                {/* Tooltip */}
                <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none">
                    Música Motivacional
                </div>
            </button>
        </div>
    );
};

export default GlobalSpotifyPlayer;
