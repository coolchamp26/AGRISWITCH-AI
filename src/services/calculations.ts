// ============================================
// AgriSwitch AI — Deterministic Calculation Engine
// ============================================
// This module performs ALL numeric calculations.
// NO LLM is used here. Every formula is transparent and auditable.

import { CALCULATION_CONSTANTS, STATE_ADJUSTMENTS } from '@/data/constants';
import type {
    FarmProfile,
    BurnScenario,
    SustainableScenario,
    SimulationResult,
    ScenarioAdjustment,
} from '@/types';

const C = CALCULATION_CONSTANTS;

/**
 * Calculate the burning scenario impact.
 * Burning is "cheap" immediately but has massive environmental cost.
 */
export function calculateBurnScenario(profile: FarmProfile): BurnScenario {
    const totalResidue = profile.landSizeAcres * C.RESIDUE_PER_ACRE_TONS;
    const totalCO2 = profile.landSizeAcres * C.CO2_PER_ACRE_BURNED_TONS;
    const immediateCost = profile.landSizeAcres * C.BURN_LABOR_COST_PER_ACRE;

    return {
        totalResidue,
        totalCO2,
        immediateCost,
        healthPenalty: 'Severe respiratory health risk, soil nutrient loss, legal penalties possible',
    };
}

/**
 * Calculate the sustainable (no-burn) scenario.
 * Higher upfront cost but subsidized, with long-term yield and carbon credit benefits.
 */
export function calculateSustainableScenario(profile: FarmProfile): SustainableScenario {
    const stateAdj = STATE_ADJUSTMENTS[profile.state] || { laborMultiplier: 1, subsidyBonus: 0 };

    // Machinery cost — if farmer has own machinery, only fuel/maintenance cost
    const machineryCostPerAcre = profile.machineryAccess
        ? C.MACHINERY_RENTAL_COST_PER_ACRE * 0.4  // Only diesel/maintenance
        : C.MACHINERY_RENTAL_COST_PER_ACRE;

    const machineryCost = profile.landSizeAcres * machineryCostPerAcre;

    // Subsidy: base CRM subsidy + state-specific bonus
    const effectiveSubsidyRate = C.MACHINERY_PURCHASE_SUBSIDY_PERCENT + stateAdj.subsidyBonus;
    const subsidyAmount = machineryCost * effectiveSubsidyRate;

    // Net cost after subsidy
    const netCost = machineryCost - subsidyAmount;

    // CO₂ saved (same amount that would have been emitted)
    const co2Saved = profile.landSizeAcres * C.CO2_PER_ACRE_BURNED_TONS;

    // Carbon credit potential
    const carbonCreditValue = co2Saved * C.CARBON_PRICE_PER_TON;

    // Yield improvement projection over 3 seasons
    const yieldBenefitPercent = C.SOIL_PRODUCTIVITY_GAIN_PERCENT * 100;
    const yieldBenefitValue =
        profile.landSizeAcres *
        C.AVERAGE_YIELD_VALUE_PER_ACRE *
        C.SOIL_PRODUCTIVITY_GAIN_PERCENT *
        C.PROJECTION_SEASONS;

    return {
        machineryCost,
        machineryCostPerAcre,
        subsidyAmount,
        netCost,
        co2Saved,
        carbonCreditValue,
        yieldBenefitPercent,
        yieldBenefitValue,
    };
}

/**
 * Generate a full comparison between burning and sustainable approaches.
 */
export function calculateComparison(profile: FarmProfile): SimulationResult {
    const burn = calculateBurnScenario(profile);
    const sustainable = calculateSustainableScenario(profile);

    // Net difference: how much more/less does sustainable cost vs burning
    // Positive = sustainable costs more upfront; negative = sustainable is cheaper
    const netDifference = sustainable.netCost - burn.immediateCost;

    // Environmental equivalents
    const treesEquivalent = Math.round(sustainable.co2Saved * C.TREES_PER_TON_CO2);
    const carsRemovedEquivalent = parseFloat(
        (sustainable.co2Saved * C.CARS_PER_TON_CO2_YEAR).toFixed(2)
    );

    return {
        farmProfile: profile,
        burn,
        sustainable,
        netDifference,
        recommendation: 'sustainable', // Always recommend sustainable based on long-term analysis
        treesEquivalent,
        carsRemovedEquivalent,
    };
}

/**
 * Recalculate with scenario simulator adjustments.
 * Applies percentage changes to diesel and labor costs.
 */
export function recalculateWithAdjustments(
    profile: FarmProfile,
    adjustments: ScenarioAdjustment
): SimulationResult {
    const adjustedProfile: FarmProfile = {
        ...profile,
        laborCostPerAcre:
            profile.laborCostPerAcre * (1 + adjustments.laborCostChangePercent / 100),
        dieselPrice:
            profile.dieselPrice * (1 + adjustments.dieselPriceChangePercent / 100),
    };

    return calculateComparison(adjustedProfile);
}

/**
 * Format currency for display (₹)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format number with Indian number system
 */
export function formatNumber(num: number, decimals = 1): string {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: decimals,
    }).format(num);
}
