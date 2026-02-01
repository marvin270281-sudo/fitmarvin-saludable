import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RoutineContextType {
    routineIds: string[];
    addToRoutine: (id: string) => void;
    removeFromRoutine: (id: string) => void;
    isInRoutine: (id: string) => boolean;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const RoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [routineIds, setRoutineIds] = useState<string[]>(() => {
        const stored = localStorage.getItem('userRoutine');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('userRoutine', JSON.stringify(routineIds));
    }, [routineIds]);

    const addToRoutine = (id: string) => {
        setRoutineIds(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    };

    const removeFromRoutine = (id: string) => {
        setRoutineIds(prev => prev.filter(item => item !== id));
    };

    const isInRoutine = (id: string) => {
        return routineIds.includes(id);
    };

    return (
        <RoutineContext.Provider value={{ routineIds, addToRoutine, removeFromRoutine, isInRoutine }}>
            {children}
        </RoutineContext.Provider>
    );
};

export const useRoutine = () => {
    const context = useContext(RoutineContext);
    if (context === undefined) {
        throw new Error('useRoutine must be used within a RoutineProvider');
    }
    return context;
};
