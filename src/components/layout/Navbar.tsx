'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { FiSun, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const { isLoggedIn } = useApp();
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-900/95 via-emerald-900/95 to-green-800/95 backdrop-blur-md border-b border-green-700/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <GiWheat className="text-3xl text-amber-400 group-hover:text-amber-300 transition-colors" />
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-green-300 bg-clip-text text-transparent">
                            AgriSwitch AI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/">{t.nav.home}</NavLink>
                        <NavLink href="/wizard">{t.nav.wizard}</NavLink>
                        <NavLink href="/results">{t.nav.results}</NavLink>
                        <NavLink href="/dashboard">{t.nav.dashboard}</NavLink>
                        <NavLink href="/simulator">{t.nav.simulator}</NavLink>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-800/60 hover:bg-green-700/60 text-green-100 text-sm font-medium transition-all border border-green-600/40"
                            title="Switch language"
                        >
                            <FiGlobe className="text-sm" />
                            {language === 'en' ? 'हिंदी' : 'EN'}
                        </button>

                        {/* Login/Status */}
                        {!isLoggedIn ? (
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-green-900 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                                <FiSun className="text-sm" />
                                {t.nav.login}
                            </Link>
                        ) : (
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600/40 text-green-200 text-sm">
                                ✓ Logged In
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 text-green-200 hover:text-white"
                        >
                            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden pb-4 pt-2 border-t border-green-700/50 mt-2 space-y-1">
                        <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>{t.nav.home}</MobileNavLink>
                        <MobileNavLink href="/wizard" onClick={() => setMenuOpen(false)}>{t.nav.wizard}</MobileNavLink>
                        <MobileNavLink href="/results" onClick={() => setMenuOpen(false)}>{t.nav.results}</MobileNavLink>
                        <MobileNavLink href="/dashboard" onClick={() => setMenuOpen(false)}>{t.nav.dashboard}</MobileNavLink>
                        <MobileNavLink href="/simulator" onClick={() => setMenuOpen(false)}>{t.nav.simulator}</MobileNavLink>
                        {!isLoggedIn && (
                            <MobileNavLink href="/login" onClick={() => setMenuOpen(false)}>{t.nav.login}</MobileNavLink>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-3 py-2 rounded-lg text-green-200 hover:text-white hover:bg-green-700/50 text-sm font-medium transition-all"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-4 py-2.5 rounded-lg text-green-200 hover:text-white hover:bg-green-700/50 text-sm font-medium transition-all"
        >
            {children}
        </Link>
    );
}
