import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/Exercises';
import NutritionPlan from './pages/Nutrition';
import Community from './pages/Community';
import ProfileSettings from './pages/Profile';
import Onboarding from './pages/Onboarding';
import DesignSystem from './pages/DesignSystem';
import AIAnalysis from './pages/AIAnalysis';
import ChatBot from './components/ChatBot';

const App = () => {
    return (
        <LanguageProvider>
            <HashRouter>
                <div className="h-screen w-screen overflow-hidden flex bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/exercises" element={<ExerciseLibrary />} />
                        <Route path="/nutrition" element={<NutritionPlan />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/design-system" element={<DesignSystem />} />
                        <Route path="/analysis" element={<AIAnalysis />} />
                    </Routes>
                    <ChatBot />
                </div>
            </HashRouter>
        </LanguageProvider>
    );
};

export default App;