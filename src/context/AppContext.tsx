'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { FarmProfile, SimulationResult } from '@/types';

interface AppContextType {
    farmProfile: FarmProfile | null;
    setFarmProfile: (profile: FarmProfile) => void;
    simulationResult: SimulationResult | null;
    setSimulationResult: (result: SimulationResult) => void;
    userEmail: string;
    setUserEmail: (email: string) => void;
    userName: string;
    setUserName: (name: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (val: boolean) => void;
}

const AppContext = createContext<AppContextType>({
    farmProfile: null,
    setFarmProfile: () => { },
    simulationResult: null,
    setSimulationResult: () => { },
    userEmail: '',
    setUserEmail: () => { },
    userName: '',
    setUserName: () => { },
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

export function AppProvider({ children }: { children: ReactNode }) {
    const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AppContext.Provider
            value={{
                farmProfile,
                setFarmProfile,
                simulationResult,
                setSimulationResult,
                userEmail,
                setUserEmail,
                userName,
                setUserName,
                isLoggedIn,
                setIsLoggedIn,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
