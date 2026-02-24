'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatNumber } from '@/services/calculations';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const COLORS = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7'];

export default function DashboardPage() {
    const { t } = useLanguage();
    const { simulationResult } = useApp();
    const router = useRouter();

    if (!simulationResult) {
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

    const r = simulationResult;

    // Chart data
    const costData = [
        { name: '🔥 Burn Cost', value: r.burn.immediateCost, fill: '#ef4444' },
        { name: '🌱 Sustainable (Gross)', value: r.sustainable.machineryCost, fill: '#f59e0b' },
        { name: '✅ Sustainable (Net)', value: r.sustainable.netCost, fill: '#22c55e' },
    ];

    const co2Data = [
        { name: 'CO₂ Emitted (Burn)', value: r.burn.totalCO2, fill: '#ef4444' },
        { name: 'CO₂ Saved', value: r.sustainable.co2Saved, fill: '#22c55e' },
    ];

    const benefitPieData = [
        { name: 'Subsidy', value: r.sustainable.subsidyAmount },
        { name: 'Carbon Credits', value: r.sustainable.carbonCreditValue },
        { name: 'Yield Benefit', value: r.sustainable.yieldBenefitValue },
    ];

    const impactCards = [
        {
            icon: '🌍',
            title: t.dashboard.co2_saved,
            value: `${formatNumber(r.sustainable.co2Saved)} tons`,
            color: 'from-green-500 to-emerald-400',
            bg: 'bg-green-500/10',
        },
        {
            icon: '🌳',
            title: t.dashboard.trees_planted,
            value: formatNumber(r.treesEquivalent, 0),
            color: 'from-emerald-500 to-teal-400',
            bg: 'bg-emerald-500/10',
        },
        {
            icon: '🚗',
            title: t.dashboard.cars_removed,
            value: formatNumber(r.carsRemovedEquivalent),
            color: 'from-blue-500 to-cyan-400',
            bg: 'bg-blue-500/10',
        },
        {
            icon: '💰',
            title: t.dashboard.net_difference,
            value: formatCurrency(r.netDifference),
            color: 'from-amber-500 to-orange-400',
            bg: 'bg-amber-500/10',
        },
        {
            icon: '📈',
            title: t.dashboard.carbon_potential,
            value: formatCurrency(r.sustainable.carbonCreditValue),
            color: 'from-purple-500 to-pink-400',
            bg: 'bg-purple-500/10',
        },
        {
            icon: '🌾',
            title: t.dashboard.yield_projection,
            value: formatCurrency(r.sustainable.yieldBenefitValue),
            color: 'from-green-500 to-lime-400',
            bg: 'bg-green-500/10',
        },
    ];

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{t.dashboard.title}</h1>
                    <p className="text-green-400">{t.dashboard.subtitle}</p>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {impactCards.map((card, i) => (
                        <div
                            key={i}
                            className={`glass-card p-5 text-center animate-slide-up ${card.bg}`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <span className="text-3xl">{card.icon}</span>
                            <p className="text-green-400 text-xs mt-2 mb-1">{card.title}</p>
                            <p className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-10">
                    {/* Cost Comparison Bar Chart */}
                    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-lg font-semibold text-amber-400 mb-4">{t.dashboard.eco_title}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={costData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a2a" />
                                <XAxis dataKey="name" tick={{ fill: '#86efac', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#86efac', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ background: '#0d2818', border: '1px solid #2d6a4f', borderRadius: 12 }}
                                    labelStyle={{ color: '#a7f3d0' }}
                                    itemStyle={{ color: '#e8f5e9' }}
                                    formatter={(value: number | string | (number | string)[] | undefined) => {
                                        const num = typeof value === 'number' ? value : 0;
                                        return [`₹${num.toLocaleString('en-IN')}`, 'Amount'];
                                    }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {costData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Benefits Pie Chart */}
                    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <h3 className="text-lg font-semibold text-amber-400 mb-4">Benefits Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={benefitPieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    fill="#22c55e"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                >
                                    {benefitPieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#0d2818', border: '1px solid #2d6a4f', borderRadius: 12 }}
                                    formatter={(value: number | string | (number | string)[] | undefined) => {
                                        const num = typeof value === 'number' ? value : 0;
                                        return [`₹${num.toLocaleString('en-IN')}`, ''];
                                    }}
                                />
                                <Legend wrapperStyle={{ color: '#86efac', fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CO₂ Chart */}
                <div className="glass-card p-6 mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">{t.dashboard.env_title}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={co2Data} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a2a" />
                            <XAxis type="number" tick={{ fill: '#86efac', fontSize: 11 }} unit=" tons" />
                            <YAxis dataKey="name" type="category" tick={{ fill: '#86efac', fontSize: 11 }} width={150} />
                            <Tooltip
                                contentStyle={{ background: '#0d2818', border: '1px solid #2d6a4f', borderRadius: 12 }}
                                formatter={(value: number | string | (number | string)[] | undefined) => {
                                    const num = typeof value === 'number' ? value : 0;
                                    return [`${num} tons`, ''];
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {co2Data.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Navigation */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href="/results"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-green-600/50 text-green-300 hover:bg-green-800/30 font-semibold transition-all"
                    >
                        <FiArrowLeft /> Back to Results
                    </Link>
                    <Link
                        href="/simulator"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-green-900 font-semibold hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg"
                    >
                        🎛️ Scenario Simulator
                    </Link>
                </div>
            </div>
        </div>
    );
}
