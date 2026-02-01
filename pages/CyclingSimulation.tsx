import React, { useState, useEffect, useRef } from 'react';
import { useMusic } from '../context/MusicContext';
import { useNavigate } from 'react-router-dom';

const CyclingSimulation = () => {
    const navigate = useNavigate();
    const [duration, setDuration] = useState(0);
    const [pedals, setPedals] = useState(0);
    const [calories, setCalories] = useState(0);
    const [distance, setDistance] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const { toggleOpen, setPlaylist } = useMusic();

    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            navigate('/onboarding');
            return;
        }
        setPlaylist("https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0");
    }, [setPlaylist, navigate]);

    // YouTube Video ID for Cycling (Virtual Cycling - 4k Video)
    const VIDEO_ID = "XGckqr1Vxp0";
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPlaying) {
            timer = setInterval(() => {
                setDuration(prev => prev + 1);

                // Update stats based on approximations
                // ~90 RPM = 1.5 pedals/sec
                setPedals(prev => prev + 1.5);
                // ~600 kcal/hr = ~0.16 kcal/sec
                setCalories(prev => prev + 0.16);
                // ~25 km/h = ~0.007 km/sec
                setDistance(prev => prev + 0.007);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isPlaying]);

    // Send commands to YouTube iframe
    const sendVideoCommand = (command: string, args: any = null) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({
                    event: 'command',
                    func: command,
                    args: args || []
                }),
                '*'
            );
        }
    };

    const handleStart = () => {
        setIsPlaying(true);
        sendVideoCommand('playVideo');
    };

    const handlePause = () => {
        setIsPlaying(false);
        sendVideoCommand('pauseVideo');
    };

    const handleStop = () => {
        setIsPlaying(false);
        sendVideoCommand('pauseVideo');
        sendVideoCommand('seekTo', [0, true]);
        sendVideoCommand('pauseVideo');
    };

    const handleReset = () => {
        setIsPlaying(false);
        setDuration(0);
        setPedals(0);
        setCalories(0);
        setDistance(0);
        sendVideoCommand('pauseVideo');
        sendVideoCommand('seekTo', [0, true]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">


            {/* YouTube Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <iframe
                    ref={iframeRef}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}`}
                    title="Cycling Simulation"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover scale-[1.35]"
                ></iframe>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex-grow flex flex-col items-center px-6 md:px-12 py-10 text-white">
                <div className="w-full max-w-screen-2xl h-full flex flex-col justify-between relative">

                    {/* Header Stats */}
                    <div className="flex justify-between items-start">
                        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 group hover:bg-black/60 transition-colors">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-1">Tiempo de sesión</p>
                            <p className="text-4xl md:text-5xl font-black font-mono tracking-tighter">{formatTime(duration)}</p>
                        </div>

                        {/* Spotify Toggle Button */}
                        <button
                            onClick={toggleOpen}
                            className="bg-[#1DB954] hover:bg-[#1ed760] text-white p-4 rounded-full shadow-lg shadow-green-500/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            title="Abrir Spotify"
                        >
                            <span className="material-symbols-outlined text-3xl">music_note</span>
                            <span className="font-bold hidden md:inline">Spotify</span>
                        </button>
                    </div>

                    {/* Controls - Bottom Right */}
                    <div className="absolute bottom-8 right-8 flex items-end justify-end pointer-events-none">
                        <div className="pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-xl p-3 rounded-full border border-white/10 transition-all hover:bg-black/80 shadow-2xl">

                            {/* Play/Pause Button */}
                            {!isPlaying ? (
                                <button
                                    onClick={handleStart}
                                    className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 group"
                                    aria-label="Iniciar ciclismo"
                                >
                                    <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">play_arrow</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handlePause}
                                    className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 group"
                                    aria-label="Pausar ciclismo"
                                >
                                    <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">pause</span>
                                </button>
                            )}

                            {/* Stop Button */}
                            <button
                                onClick={handleStop}
                                className="w-11 h-11 rounded-full bg-zinc-800/80 hover:bg-red-500 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                                title="Parar"
                                aria-label="Parar"
                            >
                                <span className="material-symbols-outlined text-2xl">stop</span>
                            </button>

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className="w-11 h-11 rounded-full bg-zinc-800/80 hover:bg-blue-500 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                                title="Reiniciar"
                                aria-label="Reiniciar"
                            >
                                <span className="material-symbols-outlined text-2xl">restart_alt</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-none">
                        <div className="bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 hover:bg-black/50 transition-colors">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="material-symbols-outlined text-cyan-500 text-sm">directions_bike</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pedaladas</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black">{Math.floor(pedals)}</p>
                        </div>

                        <div className="bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 hover:bg-black/50 transition-colors">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="material-symbols-outlined text-rose-500 text-sm">local_fire_department</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Calorías</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black">{calories.toFixed(1)}</p>
                        </div>

                        <div className="bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 hover:bg-black/50 transition-colors">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="material-symbols-outlined text-emerald-500 text-sm">distance</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Distancia (km)</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black">{distance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyclingSimulation;
