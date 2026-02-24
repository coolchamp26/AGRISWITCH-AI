'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { recalculateWithAdjustments, formatCurrency, formatNumber } from '@/services/calculations';
import { getAIExplanation } from '@/services/aiService';
import type { SimulationResult } from '@/types';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function SimulatorPage() {
    const { t, language } = useLanguage();
    const { simulationResult, farmProfile } = useApp();
    const router = useRouter();

    const [dieselChange, setDieselChange] = useState(0);
    const [laborChange, setLaborChange] = useState(0);
    const [adjusted, setAdjusted] = useState<SimulationResult | null>(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const current = adjusted || simulationResult;

    const handleRecalculate = useCallback(async () => {
        if (!farmProfile) return;

        const newResult = recalculateWithAdjustments(farmProfile, {
            dieselPriceChangePercent: dieselChange,
            laborCostChangePercent: laborChange,
        });
        setAdjusted(newResult);

        // Fetch new AI explanation
        setAiLoading(true);
        try {
            const explanation = await getAIExplanation(newResult, language);
            setAiExplanation(explanation);
        } catch {
            setAiExplanation('Unable to generate explanation for this scenario.');
        }
        setAiLoading(false);
    }, [farmProfile, dieselChange, laborChange, language]);

    const handleReset = () => {
        setDieselChange(0);
        setLaborChange(0);
        setAdjusted(null);
        setAiExplanation('');
    };

    if (!simulationResult || !farmProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="glass-card p-10 text-center max-w-md">
                    <p className="text-green-300 text-lg mb-4">No analysis data available</p>
                    <Link
                        href="/wizard"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-green-900 font-semibold"
                    >
                        <FiArrowLeft /> Go to Farm Wizard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{t.simulator.title}</h1>
                    <p className="text-green-400">{t.simulator.subtitle}</p>
                </div>

                {/* Sliders */}
                <div className="glass-card p-6 sm:p-8 mb-8 animate-slide-up">
                    <h3 className="text-lg font-semibold text-amber-400 mb-6">Adjust Parameters</h3>

                    <div className="space-y-8">
                        {/* Diesel Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-green-300 font-medium text-sm">
                                    ⛽ {t.simulator.diesel_slider}
                                </label>
                                <span className={`text-lg font-bold ${dieselChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {dieselChange >= 0 ? '+' : ''}{dieselChange}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min={-50}
                                max={100}
                                value={dieselChange}
                                onChange={(e) => setDieselChange(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-green-600 text-xs mt-1">
                                <span>-50%</span>
                                <span>0%</span>
                                <span>+100%</span>
                            </div>
                        </div>

                        {/* Labor Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-green-300 font-medium text-sm">
                                    👷 {t.simulator.labor_slider}
                                </label>
                                <span className={`text-lg font-bold ${laborChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {laborChange >= 0 ? '+' : ''}{laborChange}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min={-50}
                                max={100}
                                value={laborChange}
                                onChange={(e) => setLaborChange(parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-green-600 text-xs mt-1">
                                <span>-50%</span>
                                <span>0%</span>
                                <span>+100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={handleRecalculate}
                            disabled={aiLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-green-900 font-bold hover:from-amber-400 hover:to-amber-300 transition-all disabled:opacity-50"
                        >
                            {aiLoading ? (
                                <div className="w-5 h-5 border-2 border-green-900/30 border-t-green-900 rounded-full animate-spin" />
                            ) : (
                                <FiRefreshCw />
                            )}
                            {t.simulator.recalculate}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 rounded-xl border border-green-700/50 text-green-400 hover:bg-green-800/30 transition-all"
                        >
                            {t.simulator.reset}
                        </button>
                    </div>
                </div>

                {/* Updated Results */}
                {current && (
                    <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                        {/* Quick Summary */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div className="glass-card p-5 text-center">
                                <p className="text-green-500 text-xs mb-1">🔥 Burn Cost</p>
                                <p className="text-xl font-bold text-red-400">
                                    {formatCurrency(current.burn.immediateCost)}
                                </p>
                            </div>
                            <div className="glass-card p-5 text-center">
                                <p className="text-green-500 text-xs mb-1">🌱 Sustainable Net</p>
                                <p className="text-xl font-bold text-emerald-400">
                                    {formatCurrency(current.sustainable.netCost)}
                                </p>
                            </div>
                            <div className="glass-card p-5 text-center">
                                <p className="text-green-500 text-xs mb-1">💰 Difference</p>
                                <p className="text-xl font-bold text-amber-400">
                                    {formatCurrency(current.netDifference)}
                                </p>
                            </div>
                        </div>

                        {/* Detailed Comparison */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="glass-card p-5">
                                <h4 className="text-amber-400 font-semibold text-sm mb-3">Sustainable Benefits</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-400">Subsidy</span>
                                        <span className="text-emerald-300">{formatCurrency(current.sustainable.subsidyAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-400">Carbon Credits</span>
                                        <span className="text-emerald-300">{formatCurrency(current.sustainable.carbonCreditValue)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-400">Yield Benefit (3 seasons)</span>
                                        <span className="text-emerald-300">{formatCurrency(current.sustainable.yieldBenefitValue)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-5">
                                <h4 className="text-amber-400 font-semibold text-sm mb-3">Environmental Impact</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-400">CO₂ Saved</span>
                                        <span className="text-emerald-300">{formatNumber(current.sustainable.co2Saved)} tons</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-400">Trees Equivalent</span>
                                        <span className="text-emerald-300">{formatNumber(current.treesEquivalent, 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-400">Cars Removed</span>
                                        <span className="text-emerald-300">{formatNumber(current.carsRemovedEquivalent)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Explanation for adjusted scenario */}
                        {aiExplanation && (
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-bold text-amber-400 mb-3">
                                    🤖 AI Analysis for Adjusted Scenario
                                </h3>
                                {aiLoading ? (
                                    <div className="flex items-center gap-3 text-green-400">
                                        <div className="w-5 h-5 border-2 border-green-600 border-t-green-300 rounded-full animate-spin" />
                                        Generating analysis...
                                    </div>
                                ) : (
                                    <div className="ai-content text-green-200 text-sm leading-relaxed whitespace-pre-wrap">
                                        {aiExplanation}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex flex-wrap gap-4 justify-center mt-10">
                    <Link
                        href="/results"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-green-600/50 text-green-300 hover:bg-green-800/30 font-semibold transition-all"
                    >
                        <FiArrowLeft /> Back to Results
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold hover:from-green-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        📊 View Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
