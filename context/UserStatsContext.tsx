import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserJoinEvent {
    id: number;
    name: string;
    avatar: string;
    role: 'user' | 'admin';
    timestamp: number;
}

interface UserStatsContextType {
    totalUsers: number;
    onlineUsers: number;
    lastJoiner: UserJoinEvent | null;
    members: UserJoinEvent[];
    markAsWelcomed: (id: number) => void;
    deleteAccount: () => void;
    logout: () => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

import { IMAGES } from '../constants';

export const UserStatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initial base for total users
    const INITIAL_BASE_USERS = 1;

    const [totalUsers, setTotalUsers] = useState(() => {
        const stored = localStorage.getItem('app_total_users');
        const count = stored ? parseInt(stored, 10) : INITIAL_BASE_USERS;
        if (count > 1000) return 1;
        return count;
    });

    const [onlineUsers, setOnlineUsers] = useState(1);
    const [lastJoiner, setLastJoiner] = useState<UserJoinEvent | null>(null);
    const [members, setMembers] = useState<UserJoinEvent[]>(() => {
        const stored = localStorage.getItem('app_members');
        return stored ? JSON.parse(stored) : [];
    });

    const navigate = useNavigate();

    // Sync current user to members list and handle persistence
    useEffect(() => {
        const syncCurrentMember = () => {
            const name = localStorage.getItem('userName');
            const avatar = localStorage.getItem('userAvatar');
            const weight = localStorage.getItem('userWeight');
            const role = (localStorage.getItem('userRole') as 'user' | 'admin') || 'user';

            if (name) {
                setMembers(prev => {
                    const alreadyExists = prev.some(m => m.name === name);
                    let updated;
                    if (alreadyExists) {
                        updated = prev.map(m => m.name === name ? {
                            ...m,
                            avatar: avatar || IMAGES.USER_AVATAR,
                            weight: weight || m.weight,
                            role: role
                        } : m);
                    } else {
                        const newMember = {
                            id: Date.now(),
                            name: name,
                            avatar: avatar || IMAGES.USER_AVATAR,
                            weight: weight || '75',
                            role: role,
                            timestamp: Date.now()
                        };
                        updated = [newMember, ...prev];
                    }
                    localStorage.setItem('app_members', JSON.stringify(updated));
                    return updated;
                });
            }
        };

        syncCurrentMember();

        window.addEventListener('user-update', syncCurrentMember);
        return () => window.removeEventListener('user-update', syncCurrentMember);
    }, []);

    // Persist changes
    useEffect(() => {
        localStorage.setItem('app_total_users', totalUsers.toString());
        localStorage.setItem('app_members', JSON.stringify(members));
    }, [totalUsers, members]);

    // Update online users
    useEffect(() => {
        setOnlineUsers(1); // Always at least 1 (the current user)

        const statsInterval = setInterval(() => {
            setOnlineUsers(1);
        }, 10000);

        return () => clearInterval(statsInterval);
    }, []);

    const markAsWelcomed = (id: number) => {
        // We can keep this for internal logic or simple removal for the admin
        // But for "members", we probably don't want to remove them.
        // This function might be repurposed or removed if no longer needed for a "join queue" concept.
    };

    const deleteAccount = () => {
        const name = localStorage.getItem('userName');
        setTotalUsers(prev => Math.max(1, prev - 1)); // Ensure total users doesn't go below 1 if current user is the only one
        setMembers(prev => prev.filter(m => m.name !== name));

        localStorage.removeItem('userName');
        localStorage.removeItem('userWeight');
        localStorage.removeItem('userHeight');
        localStorage.removeItem('userInstagram');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userAttendance'); // This was in original, keep it
        localStorage.removeItem('userWeightHistory'); // This was in original, keep it
        localStorage.removeItem('app_members'); // Remove members data on account deletion
        navigate('/onboarding');
    };

    const logout = () => {
        localStorage.removeItem('userName');
        window.dispatchEvent(new Event('user-update'));
        navigate('/onboarding');
    };

    return (
        <UserStatsContext.Provider value={{ totalUsers, onlineUsers, lastJoiner, members, markAsWelcomed, deleteAccount, logout }}>
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
