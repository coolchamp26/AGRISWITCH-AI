'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GiWheat, GiFactory, GiReceiveMoney, GiTreeGrowth } from 'react-icons/gi';
import { FiArrowRight, FiBarChart2, FiShield, FiTrendingUp } from 'react-icons/fi';

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    { icon: <FiBarChart2 size={28} />, title: t.home.feature1_title, desc: t.home.feature1_desc, color: 'from-blue-400 to-cyan-400' },
    { icon: <FiShield size={28} />, title: t.home.feature2_title, desc: t.home.feature2_desc, color: 'from-amber-400 to-orange-400' },
    { icon: <FiTrendingUp size={28} />, title: t.home.feature3_title, desc: t.home.feature3_desc, color: 'from-green-400 to-emerald-400' },
    { icon: <GiReceiveMoney size={28} />, title: t.home.feature4_title, desc: t.home.feature4_desc, color: 'from-purple-400 to-pink-400' },
  ];

  const stats = [
    { value: '15M+', label: 'Acres Burned Annually', icon: <GiFactory className="text-red-400" /> },
    { value: '37.5M', label: 'Tons CO₂ Emitted', icon: <GiWheat className="text-amber-400" /> },
    { value: '₹2,500Cr', label: 'Subsidies Available', icon: <GiReceiveMoney className="text-green-400" /> },
    { value: '45%', label: 'Potential Cost Savings', icon: <GiTreeGrowth className="text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-800/40 border border-green-600/30 text-green-300 text-sm mb-6">
            <GiWheat className="text-amber-400" />
            AI-Powered Decision Intelligence for Indian Farmers
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="gradient-text">{t.home.hero_title}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-green-200 font-medium mb-4">
            {t.home.hero_subtitle}
          </p>

          <p className="text-green-400 text-base sm:text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
            {t.home.hero_description}
          </p>

          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-green-900 font-bold text-lg transition-all shadow-xl hover:shadow-2xl pulse-glow group"
          >
            {t.home.cta_button}
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-4 bg-green-900/30 border-y border-green-800/30">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex justify-center mb-2 text-2xl">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-green-400 text-xs sm:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 gradient-text">
            How AgriSwitch AI Helps You
          </h2>
          <p className="text-green-400 text-center mb-12 max-w-2xl mx-auto">
            Make data-driven decisions about stubble management with transparent calculations and AI-powered insights
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card p-6 hover:bg-white/10 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} bg-opacity-20 text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-green-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-green-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 gradient-text">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter Farm Details', desc: 'Tell us about your land, crop, and current costs in our simple wizard' },
              { step: '02', title: 'Get Analysis', desc: 'See a transparent comparison of burning vs sustainable management with real numbers' },
              { step: '03', title: 'Take Action', desc: 'Download subsidy applications, understand schemes, and plan your transition' },
            ].map((item, i) => (
              <div key={i} className="text-center animate-slide-up" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 items-center justify-center text-green-900 font-extrabold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-green-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card p-10 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to make a smarter choice?
          </h2>
          <p className="text-green-300 mb-8">
            Join thousands of farmers discovering the economic benefits of sustainable residue management.
          </p>
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-green-900 font-bold text-lg transition-all shadow-xl hover:shadow-2xl group"
          >
            Start Your Free Analysis
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
