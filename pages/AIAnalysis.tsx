import React, { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { analyzeMediaWithGemini } from '../services/geminiService';

const AIAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setAnalysis('');
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const isVideo = file.type.startsWith('video/');
            const prompt = isVideo 
                ? "Analyze this fitness video. Describe the exercise being performed, checking for proper form. Identify the muscles worked and suggest any corrections or safety tips." 
                : "Analyze this image related to fitness or nutrition. If it's food, estimate calories and macros. If it's equipment or a gym setting, explain how to use it or what exercises can be done.";
            
            const result = await analyzeMediaWithGemini(file, prompt);
            setAnalysis(result);
        } catch (error) {
            setAnalysis("Error analyzing media. Please try again with a smaller file or different format.");
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex h-full">
            <Sidebar />
            <main className="flex-grow flex flex-col h-full overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark p-8">
                <header className="mb-10">
                    <h2 className="text-4xl font-black tracking-tight mb-2">AI Coach Vision</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Upload photos of meals or videos of your workouts for instant professional feedback.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Upload Section */}
                    <div className="space-y-6">
                        <div 
                            onClick={triggerFileInput}
                            className={`border-2 border-dashed rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                file ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-border-dark hover:border-primary/50'
                            }`}
                        >
                            {preview ? (
                                <div className="relative w-full h-full p-4">
                                    {file?.type.startsWith('video/') ? (
                                        <video src={preview} controls className="w-full h-full object-contain rounded-2xl" />
                                    ) : (
                                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setAnalysis(''); }}
                                        className="absolute top-6 right-6 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                    </div>
                                    <p className="font-bold text-lg mb-2">Click to upload</p>
                                    <p className="text-slate-500 text-sm">Support for Images (JPG, PNG) and Short Videos (MP4)</p>
                                </div>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*,video/*" 
                                onChange={handleFileChange} 
                            />
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={!file || loading}
                            className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">sync</span> Analyzing...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">auto_awesome</span> Analyze with Gemini
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-3xl p-8 min-h-[400px] flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-border-dark">
                            <div className="size-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <span className="material-symbols-outlined">psychology</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Analysis Result</h3>
                                <p className="text-xs text-slate-500">Powered by Gemini 1.5 Pro</p>
                            </div>
                        </div>
                        
                        <div className="flex-grow">
                            {analysis ? (
                                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                    {analysis}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                    <span className="material-symbols-outlined text-6xl mb-4">analytics</span>
                                    <p>Results will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIAnalysis;
