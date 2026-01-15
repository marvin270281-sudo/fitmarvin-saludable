import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

const Onboarding = () => {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');

    const handleLogin = () => {
        if (name.trim()) {
            localStorage.setItem('userName', name);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
            {/* Background Image (Logo) */}
            <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                    backgroundImage: `url(${IMAGES.LOGO})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            ></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-background-dark/95"></div>

            <div className="max-w-xl w-full text-center mb-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                    ¡Hola! <span className="text-primary">¿Cómo te llamas?</span>
                </h1>
                <p className="text-slate-500 text-lg">Para dirigirnos a ti como te mereces.</p>
                <div className="mt-8">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Escribe tu nombre..."
                        className="w-full text-center text-2xl font-bold py-4 bg-transparent border-b-2 border-slate-200 focus:border-primary outline-none transition-colors placeholder:text-slate-300"
                        autoFocus
                    />
                </div>
            </div>

            <div className="max-w-xl w-full mt-12 space-y-4 relative z-10">
                <button
                    onClick={handleLogin}
                    className={`w-full bg-primary py-4 rounded-2xl text-black font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all ${!name.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!name.trim()}
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
