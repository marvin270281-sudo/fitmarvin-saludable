import React from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const MusicPlayer = () => {
    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-grow flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark">
                <TopHeader />
                <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <header className="mb-10">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                                <span className="material-symbols-outlined text-green-500 text-5xl">music_note</span>
                                Zona de Energía
                            </h1>
                            <p className="text-slate-500 text-lg">
                                La mejor música para romper tus récords.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Workout Playlist */}
                            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 h-[500px]">
                                <iframe
                                    style={{ borderRadius: '12px' }}
                                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator&theme=0"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title="Workout Beast Mode"
                                ></iframe>
                            </div>

                            {/* Cardio/Focus Playlist */}
                            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 h-[500px]">
                                <iframe
                                    style={{ borderRadius: '12px' }}
                                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DX32xsHFHtrg7?utm_source=generator&theme=0"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    title="Gym Phonk"
                                ></iframe>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default MusicPlayer;
