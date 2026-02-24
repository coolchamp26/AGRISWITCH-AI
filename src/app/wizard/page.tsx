'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { calculateComparison } from '@/services/calculations';
import { DEFAULT_FARM_VALUES } from '@/data/constants';
import type { FarmProfile, IndianState, CropType } from '@/types';
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import { FiTruck } from 'react-icons/fi';

const STEPS = 4;

export default function WizardPage() {
    const { t } = useLanguage();
    const { setFarmProfile, setSimulationResult } = useApp();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FarmProfile>({
        landSizeAcres: DEFAULT_FARM_VALUES.landSizeAcres,
        state: DEFAULT_FARM_VALUES.state,
        cropType: DEFAULT_FARM_VALUES.cropType,
        machineryAccess: DEFAULT_FARM_VALUES.machineryAccess,
        laborCostPerAcre: DEFAULT_FARM_VALUES.laborCostPerAcre,
        dieselPrice: DEFAULT_FARM_VALUES.dieselPrice,
    });

    const validate = (): boolean => {
        const errs: Record<string, string> = {};
        if (step === 1) {
            if (!formData.landSizeAcres || formData.landSizeAcres < 0.5 || formData.landSizeAcres > 500) {
                errs.landSize = t.wizard.validation_land;
            }
        }
        if (step === 4) {
            if (!formData.laborCostPerAcre || formData.laborCostPerAcre <= 0) {
                errs.laborCost = t.wizard.validation_labor;
            }
            if (!formData.dieselPrice || formData.dieselPrice <= 0) {
                errs.dieselPrice = t.wizard.validation_diesel;
            }
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (!validate()) return;
        if (step < STEPS) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const result = calculateComparison(formData);
        setFarmProfile(formData);
        setSimulationResult(result);
        router.push('/results');
    };

    const stepLabels = [t.wizard.step1, t.wizard.step2, t.wizard.step3, t.wizard.step4];

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="absolute top-32 left-10 w-64 h-64 bg-green-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl" />

            <div className="max-w-2xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <GiWheat className="text-5xl text-amber-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">{t.wizard.title}</h1>
                    <p className="text-green-400 text-sm">{t.wizard.subtitle}</p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex justify-between mb-3">
                        {stepLabels.map((label, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all ${i + 1 <= step
                                        ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-green-900'
                                        : 'bg-green-800/50 text-green-500 border border-green-700/50'
                                        }`}
                                >
                                    {i + 1 < step ? <FiCheck size={16} /> : i + 1}
                                </div>
                                <span className={`text-xs ${i + 1 <= step ? 'text-amber-400' : 'text-green-600'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill bg-gradient-to-r from-amber-500 to-green-400"
                            style={{ width: `${(step / STEPS) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card p-6 sm:p-8 animate-slide-up">
                    {/* Step 1: Land Size */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FiTruck className="text-3xl text-amber-400" />
                                <h2 className="text-xl font-semibold text-white">{t.wizard.step1}</h2>
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-2">
                                    {t.wizard.land_size_label}
                                </label>
                                <input
                                    type="number"
                                    value={formData.landSizeAcres}
                                    onChange={(e) => setFormData({ ...formData, landSizeAcres: parseFloat(e.target.value) || 0 })}
                                    placeholder={t.wizard.land_size_placeholder}
                                    className="w-full px-4 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-white placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-lg"
                                    min={0.5}
                                    max={500}
                                    step={0.5}
                                />
                                {errors.landSize && (
                                    <p className="text-red-400 text-sm mt-2">{errors.landSize}</p>
                                )}
                                <p className="text-green-600 text-xs mt-2">
                                    Average Indian farm: 2.5 acres. Enter your total cultivable paddy land.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: State */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <GiWheat className="text-3xl text-amber-400" />
                                <h2 className="text-xl font-semibold text-white">{t.wizard.step2}</h2>
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-3">
                                    {t.wizard.state_label}
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {(['Punjab', 'Haryana', 'Uttar Pradesh'] as IndianState[]).map((state) => (
                                        <button
                                            key={state}
                                            onClick={() => setFormData({ ...formData, state })}
                                            className={`p-4 rounded-xl border text-left transition-all ${formData.state === state
                                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                                                : 'bg-green-900/30 border-green-700/40 text-green-300 hover:bg-green-800/40'
                                                }`}
                                        >
                                            <span className="font-semibold">{state}</span>
                                            {state === 'Punjab' && <span className="text-xs text-green-500 ml-2">Highest stubble burning</span>}
                                            {state === 'Haryana' && <span className="text-xs text-green-500 ml-2">15% extra subsidy bonus</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Crop & Machinery */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FiTruck className="text-3xl text-amber-400" />
                                <h2 className="text-xl font-semibold text-white">{t.wizard.step3}</h2>
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-3">
                                    {t.wizard.crop_type_label}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['Paddy', 'Wheat', 'Sugarcane'] as CropType[]).map((crop) => (
                                        <button
                                            key={crop}
                                            onClick={() => setFormData({ ...formData, cropType: crop })}
                                            className={`p-3 rounded-xl border text-center transition-all ${formData.cropType === crop
                                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                                                : 'bg-green-900/30 border-green-700/40 text-green-300 hover:bg-green-800/40'
                                                }`}
                                        >
                                            {crop}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-3">
                                    {t.wizard.machinery_label}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setFormData({ ...formData, machineryAccess: true })}
                                        className={`p-4 rounded-xl border text-center transition-all ${formData.machineryAccess
                                            ? 'bg-green-500/15 border-green-500/50 text-green-300'
                                            : 'bg-green-900/30 border-green-700/40 text-green-400 hover:bg-green-800/40'
                                            }`}
                                    >
                                        <FiTruck className="text-2xl mx-auto mb-1" />
                                        {t.wizard.machinery_yes}
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, machineryAccess: false })}
                                        className={`p-4 rounded-xl border text-center transition-all ${!formData.machineryAccess
                                            ? 'bg-red-500/15 border-red-500/50 text-red-300'
                                            : 'bg-green-900/30 border-green-700/40 text-green-400 hover:bg-green-800/40'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">✗</span>
                                        {t.wizard.machinery_no}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Costs */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-3xl">💰</span>
                                <h2 className="text-xl font-semibold text-white">{t.wizard.step4}</h2>
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-2">
                                    {t.wizard.labor_cost_label}
                                </label>
                                <input
                                    type="number"
                                    value={formData.laborCostPerAcre}
                                    onChange={(e) => setFormData({ ...formData, laborCostPerAcre: parseFloat(e.target.value) || 0 })}
                                    placeholder={t.wizard.labor_cost_placeholder}
                                    className="w-full px-4 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-white placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    min={0}
                                />
                                {errors.laborCost && (
                                    <p className="text-red-400 text-sm mt-2">{errors.laborCost}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-2">
                                    {t.wizard.diesel_label}
                                </label>
                                <input
                                    type="number"
                                    value={formData.dieselPrice}
                                    onChange={(e) => setFormData({ ...formData, dieselPrice: parseFloat(e.target.value) || 0 })}
                                    placeholder={t.wizard.diesel_placeholder}
                                    className="w-full px-4 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-white placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    min={0}
                                />
                                {errors.dieselPrice && (
                                    <p className="text-red-400 text-sm mt-2">{errors.dieselPrice}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-green-700/30">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-green-700/50 text-green-300 hover:bg-green-800/30 transition-all"
                            >
                                <FiArrowLeft size={16} />
                                {t.wizard.back}
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < STEPS ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-green-900 font-semibold hover:from-amber-400 hover:to-amber-300 transition-all"
                            >
                                {t.wizard.next}
                                <FiArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-green-900 font-bold hover:from-green-400 hover:to-emerald-300 transition-all shadow-lg"
                            >
                                {t.wizard.submit}
                                <FiArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
