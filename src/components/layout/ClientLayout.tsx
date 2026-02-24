'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <AppProvider>
                <Navbar />
                <main className="flex-1 pt-16">{children}</main>
                <Footer />
            </AppProvider>
        </LanguageProvider>
    );
}
