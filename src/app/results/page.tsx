'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatNumber } from '@/services/calculations';
import { getAIExplanation, getAIPolicySummary, getAIApplicationDraft } from '@/services/aiService';
import { generatePDF } from '@/lib/pdf';
import { FiDownload, FiBarChart2, FiSliders } from 'react-icons/fi';
import Link from 'next/link';

export default function ResultsPage() {
    const { t, language } = useLanguage();
    const { simulationResult, farmProfile, userName } = useApp();
    const router = useRouter();

    const [aiExplanation, setAiExplanation] = useState('');
    const [policySummary, setPolicySummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [policyLoading, setPolicyLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!simulationResult) {
            router.push('/wizard');
            return;
        }
        fetchAIExplanation();
        fetchPolicySummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [simulationResult]);

    const fetchAIExplanation = async () => {
        if (!simulationResult) return;
        setAiLoading(true);
        try {
            const explanation = await getAIExplanation(simulationResult, language);
            setAiExplanation(explanation);
        } catch {
            setAiExplanation('Unable to load AI explanation at this time. The deterministic calculations above are still accurate.');
        }
        setAiLoading(false);
    };

    const fetchPolicySummary = async () => {
        if (!farmProfile) return;
        setPolicyLoading(true);
        try {
            const summary = await getAIPolicySummary(farmProfile.state, language);
            setPolicySummary(summary);
        } catch {
            setPolicySummary('Unable to load policy summary. Please check the available schemes for your state on the agriculture department website.');
        }
        setPolicyLoading(false);
    };

    const handleDownloadDraft = async (type: 'subsidy' | 'bank_loan') => {
        if (!simulationResult || !farmProfile) return;
        setDraftLoading(type);
        try {
            const draft = await getAIApplicationDraft(
                userName || 'Farmer',
                '',
                farmProfile.state,
                farmProfile.landSizeAcres,
                farmProfile.cropType,
                simulationResult,
                type,
                language
            );
            const title = type === 'subsidy' ? 'Subsidy Application — CRM Scheme' : 'Bank Loan Application — CRM Machinery';
            const fileName = type === 'subsidy' ? 'subsidy_application.pdf' : 'bank_loan_application.pdf';
            generatePDF(title, draft, fileName);
        } catch {
            alert('Failed to generate draft. Please try again.');
        }
        setDraftLoading(null);
    };

    if (!simulationResult) return null;

    const r = simulationResult;

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{t.results.title}</h1>
                    <p className="text-green-400">{t.results.subtitle}</p>
                    <p className="text-green-600 text-sm mt-2">
                        {r.farmProfile.landSizeAcres} acres • {r.farmProfile.state} • {r.farmProfile.cropType}
                    </p>
                </div>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Burn Card */}
                    <div className="burn-card p-6 animate-slide-up">
                        <h2 className="text-xl font-bold text-red-400 mb-4">{t.results.burn_title}</h2>
                        <div className="space-y-4">
                            <ResultRow label={t.results.total_residue} value={`${formatNumber(r.burn.totalResidue)} ${t.results.tons}`} />
                            <ResultRow label={t.results.total_co2} value={`${formatNumber(r.burn.totalCO2)} ${t.results.tons}`} highlight="red" />
                            <ResultRow label={t.results.immediate_cost} value={formatCurrency(r.burn.immediateCost)} />
                            <div className="pt-3 border-t border-red-500/20">
                                <p className="text-red-300 text-xs leading-relaxed">
                                    ⚠️ {r.burn.healthPenalty}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sustainable Card */}
                    <div className="sustainable-card p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                        <h2 className="text-xl font-bold text-emerald-400 mb-4">{t.results.sustainable_title}</h2>
                        <div className="space-y-4">
                            <ResultRow label={t.results.machinery_cost} value={formatCurrency(r.sustainable.machineryCost)} />
                            <ResultRow label={t.results.subsidy} value={`- ${formatCurrency(r.sustainable.subsidyAmount)}`} highlight="green" />
                            <ResultRow label={t.results.net_cost} value={formatCurrency(r.sustainable.netCost)} bold />
                            <ResultRow label={t.results.co2_saved} value={`${formatNumber(r.sustainable.co2Saved)} ${t.results.tons}`} highlight="green" />
                            <ResultRow label={t.results.carbon_credit} value={formatCurrency(r.sustainable.carbonCreditValue)} />
                            <ResultRow label={t.results.yield_benefit} value={formatCurrency(r.sustainable.yieldBenefitValue)} />
                        </div>
                    </div>
                </div>

                {/* Net Difference Summary */}
                <div className="glass-card p-6 mb-8 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div>
                            <p className="text-green-500 text-sm">{t.results.net_difference}</p>
                            <p className="text-2xl font-bold text-amber-400">{formatCurrency(r.netDifference)}</p>
                            <p className="text-green-600 text-xs">additional upfront cost</p>
                        </div>
                        <div>
                            <p className="text-green-500 text-sm">🌳 {t.results.co2_saved}</p>
                            <p className="text-2xl font-bold text-emerald-400">{formatNumber(r.sustainable.co2Saved)} tons</p>
                            <p className="text-green-600 text-xs">≈ {r.treesEquivalent} trees planted</p>
                        </div>
                        <div>
                            <p className="text-green-500 text-sm">💰 3-Season Net Benefit</p>
                            <p className="text-2xl font-bold text-green-400">
                                {formatCurrency(r.sustainable.yieldBenefitValue + r.sustainable.carbonCreditValue - r.netDifference)}
                            </p>
                            <p className="text-green-600 text-xs">yield + carbon credits − extra cost</p>
                        </div>
                    </div>
                </div>

                {/* Visual Comparison Bar */}
                <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                    <h3 className="text-sm text-green-400 font-semibold mb-4">Cost Comparison</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-red-400">🔥 Burning Cost</span>
                                <span className="text-red-300">{formatCurrency(r.burn.immediateCost)}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill bg-gradient-to-r from-red-500 to-red-400" style={{ width: `${(r.burn.immediateCost / Math.max(r.burn.immediateCost, r.sustainable.machineryCost)) * 100}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-400">🌱 Sustainable (Before Subsidy)</span>
                                <span className="text-green-300">{formatCurrency(r.sustainable.machineryCost)}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill bg-gradient-to-r from-green-600 to-green-500" style={{ width: `${(r.sustainable.machineryCost / Math.max(r.burn.immediateCost, r.sustainable.machineryCost)) * 100}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-emerald-400">✅ Sustainable (After Subsidy)</span>
                                <span className="text-emerald-300">{formatCurrency(r.sustainable.netCost)}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${(r.sustainable.netCost / Math.max(r.burn.immediateCost, r.sustainable.machineryCost)) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Explanation */}
                <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-lg font-bold text-amber-400 mb-4">🤖 {t.results.ai_explanation}</h2>
                    {aiLoading ? (
                        <div className="flex items-center gap-3 text-green-400">
                            <div className="w-5 h-5 border-2 border-green-600 border-t-green-300 rounded-full animate-spin" />
                            {t.results.ai_loading}
                        </div>
                    ) : (
                        <div className="ai-content text-green-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {aiExplanation}
                        </div>
                    )}
                </div>

                {/* Policy Summary */}
                <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.35s' }}>
                    <h2 className="text-lg font-bold text-amber-400 mb-4">📋 {t.results.policy_title}</h2>
                    {policyLoading ? (
                        <div className="flex items-center gap-3 text-green-400">
                            <div className="w-5 h-5 border-2 border-green-600 border-t-green-300 rounded-full animate-spin" />
                            {t.results.policy_loading}
                        </div>
                    ) : (
                        <div className="ai-content text-green-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {policySummary}
                        </div>
                    )}
                </div>

                {/* Download Section */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={() => handleDownloadDraft('subsidy')}
                        disabled={!!draftLoading}
                        className="glass-card p-5 flex items-center gap-4 hover:bg-white/10 transition-all group disabled:opacity-50"
                    >
                        <div className="p-3 rounded-xl bg-amber-500/15">
                            <FiDownload className="text-amber-400 text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold text-sm">{t.results.download_subsidy}</p>
                            <p className="text-green-500 text-xs">PDF format</p>
                        </div>
                        {draftLoading === 'subsidy' && (
                            <div className="ml-auto w-5 h-5 border-2 border-green-600 border-t-amber-400 rounded-full animate-spin" />
                        )}
                    </button>
                    <button
                        onClick={() => handleDownloadDraft('bank_loan')}
                        disabled={!!draftLoading}
                        className="glass-card p-5 flex items-center gap-4 hover:bg-white/10 transition-all group disabled:opacity-50"
                    >
                        <div className="p-3 rounded-xl bg-green-500/15">
                            <FiDownload className="text-green-400 text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold text-sm">{t.results.download_loan}</p>
                            <p className="text-green-500 text-xs">PDF format</p>
                        </div>
                        {draftLoading === 'bank_loan' && (
                            <div className="ml-auto w-5 h-5 border-2 border-green-600 border-t-green-400 rounded-full animate-spin" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex flex-wrap gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.45s' }}>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold hover:from-green-500 hover:to-emerald-400 transition-all shadow-lg"
                    >
                        <FiBarChart2 /> View Impact Dashboard
                    </Link>
                    <Link
                        href="/simulator"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-green-600/50 text-green-300 hover:bg-green-800/30 font-semibold transition-all"
                    >
                        <FiSliders /> Scenario Simulator
                    </Link>
                </div>

                {/* Disclaimer */}
                <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
                    <p className="text-amber-300 text-xs">{t.results.disclaimer}</p>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight, bold }: {
    label: string;
    value: string;
    highlight?: 'red' | 'green';
    bold?: boolean;
}) {
    const valueColor = highlight === 'red' ? 'text-red-400' : highlight === 'green' ? 'text-emerald-400' : 'text-white';
    return (
        <div className="flex justify-between items-center">
            <span className="text-green-400 text-sm">{label}</span>
            <span className={`${valueColor} ${bold ? 'font-bold text-lg' : 'font-semibold'}`}>
                {value}
            </span>
        </div>
    );
}
