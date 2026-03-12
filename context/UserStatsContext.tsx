import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserStatsContextType {
    totalUsers: number;
    onlineUsers: number;
    deleteAccount: () => void;
    logout: () => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export const UserStatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const INITIAL_BASE_USERS = 1;

    const [totalUsers, setTotalUsers] = useState(() => {
        const stored = localStorage.getItem('app_total_users');
        const count = stored ? parseInt(stored, 10) : INITIAL_BASE_USERS;
        if (count > 1000) return 1;
        return count;
    });

    const [onlineUsers, setOnlineUsers] = useState(1);

    // realtime presence via WebSocket
    useEffect(() => {
        let ws: WebSocket | null = null;
        try {
            ws = new WebSocket('ws://localhost:4000');
            ws.onmessage = (evt) => {
                try {
                    const data = JSON.parse(evt.data);
                    if (data.type === 'presence' && typeof data.count === 'number') {
                        setOnlineUsers(data.count);
                    }
                } catch {}
            };
        } catch (e) {
            console.error('Failed to connect to presence server', e);
        }
        return () => {
            if (ws) ws.close();
        };
    }, []);

    const navigate = useNavigate();

    // Persist total users
    useEffect(() => {
        localStorage.setItem('app_total_users', totalUsers.toString());
    }, [totalUsers]);

    const deleteAccount = () => {
        const name = localStorage.getItem('userName');
        setTotalUsers(prev => Math.max(1, prev - 1));

        localStorage.removeItem('userName');
        localStorage.removeItem('userWeight');
        localStorage.removeItem('userHeight');
        localStorage.removeItem('userInstagram');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userAttendance');
        localStorage.removeItem('userWeightHistory');
        navigate('/onboarding');
    };

    const logout = () => {
        localStorage.removeItem('userName');
        window.dispatchEvent(new Event('user-update'));
        navigate('/onboarding');
    };

    return (
        <UserStatsContext.Provider value={{ totalUsers, onlineUsers, deleteAccount, logout }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => {
    const context = useContext(UserStatsContext);
    if (context === undefined) {
        throw new Error('useUserStats must be used within a UserStatsProvider');
    }
    return context;
};
