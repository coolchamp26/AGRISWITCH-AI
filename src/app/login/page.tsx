'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function LoginPage() {
    const { t } = useLanguage();
    const { setUserEmail, setIsLoggedIn, setUserName } = useApp();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithOtp({ email });
            if (authError) throw authError;
            setStep('otp');
            setSuccess(t.login.otp_sent);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to send OTP';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) {
            setError('Please enter at least 6-digit OTP');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });
            if (authError) throw authError;

            setUserEmail(email);
            setUserName(email.split('@')[0]);
            setIsLoggedIn(true);
            router.push('/wizard');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Invalid OTP';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSkipLogin = () => {
        setUserEmail('demo@agriswitch.ai');
        setUserName('Demo Farmer');
        setIsLoggedIn(true);
        router.push('/wizard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />

            <div className="glass-card p-8 sm:p-10 w-full max-w-md animate-slide-up relative">
                {/* Header */}
                <div className="text-center mb-8">
                    <GiWheat className="text-5xl text-amber-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">{t.login.title}</h1>
                    <p className="text-green-400 text-sm">{t.login.subtitle}</p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 text-sm">
                        {success}
                    </div>
                )}

                {step === 'email' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-green-300 text-sm font-medium mb-2">
                                {t.login.email_label}
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.login.email_placeholder}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-white placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-green-900 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-green-900/30 border-t-green-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t.login.send_otp}
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-green-300 text-sm font-medium mb-2">
                                {t.login.otp_label}
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    placeholder={t.login.otp_placeholder}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-white placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-center tracking-widest text-lg"
                                    maxLength={8}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleVerifyOTP}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-green-900 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-green-900/30 border-t-green-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    {t.login.verify}
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => { setStep('email'); setOtp(''); setError(''); setSuccess(''); }}
                            className="w-full py-2 text-green-400 hover:text-green-300 text-sm transition-colors"
                        >
                            ← Change email
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-green-700/50" />
                    <span className="text-green-600 text-xs">or</span>
                    <div className="flex-1 h-px bg-green-700/50" />
                </div>

                {/* Skip Login */}
                <button
                    onClick={handleSkipLogin}
                    className="w-full py-3 rounded-xl border border-green-700/50 text-green-300 hover:bg-green-800/30 hover:text-green-200 font-medium transition-all text-sm"
                >
                    {t.login.skip}
                </button>
            </div>
        </div>
    );
}
