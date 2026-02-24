// ============================================
// AgriSwitch AI — TypeScript Type Definitions
// ============================================

/** Supported Indian states for the platform */
export type IndianState = 'Punjab' | 'Haryana' | 'Uttar Pradesh';

/** Supported crop types */
export type CropType = 'Paddy' | 'Wheat' | 'Sugarcane';

/** Supported languages */
export type Language = 'en' | 'hi';

/** User's farm profile collected via wizard */
export interface FarmProfile {
  userId?: string;
  landSizeAcres: number;
  state: IndianState;
  cropType: CropType;
  machineryAccess: boolean;
  laborCostPerAcre: number;
  dieselPrice: number;
}

/** Burning scenario calculation results */
export interface BurnScenario {
  totalResidue: number;       // tons
  totalCO2: number;           // tons
  immediateCost: number;      // ₹ (labor for burning)
  healthPenalty: string;      // qualitative
}

/** Sustainable scenario calculation results */
export interface SustainableScenario {
  machineryCost: number;          // ₹ total
  machineryCostPerAcre: number;   // ₹ per acre
  subsidyAmount: number;          // ₹ total
  netCost: number;                // ₹ after subsidy
  co2Saved: number;               // tons
  carbonCreditValue: number;      // ₹
  yieldBenefitPercent: number;    // % over 3 seasons
  yieldBenefitValue: number;      // ₹ estimated
}

/** Combined simulation result */
export interface SimulationResult {
  farmProfile: FarmProfile;
  burn: BurnScenario;
  sustainable: SustainableScenario;
  netDifference: number;         // ₹ (burn cost - sustainable net cost)
  recommendation: 'sustainable' | 'burn';
  treesEquivalent: number;
  carsRemovedEquivalent: number;
}

/** Scenario simulator adjustment deltas (percentage) */
export interface ScenarioAdjustment {
  dieselPriceChangePercent: number;
  laborCostChangePercent: number;
}

/** Policy scheme from static dataset */
export interface PolicyScheme {
  id: string;
  name: string;
  state: IndianState | 'Central';
  description: string;
  eligibility: string[];
  documentsRequired: string[];
  howToApply: string[];
  subsidyPercent: number;
  maxAmount: string;
  deadline: string;
  source: string;
}

/** AI-generated explanation */
export interface AIExplanation {
  summary: string;
  shortTermAnalysis: string;
  longTermAnalysis: string;
  recommendation: string;
  environmentalImpact: string;
}

/** Application draft types */
export type DraftType = 'subsidy' | 'bank_loan';

/** User data for application draft */
export interface DraftUserData {
  name: string;
  email: string;
  state: IndianState;
  landSizeAcres: number;
  cropType: CropType;
  farmProfile: FarmProfile;
  simulationResult: SimulationResult;
}

/** Supabase database row types */
export interface DBFarmProfile {
  id?: string;
  user_id: string;
  land_size_acres: number;
  state: string;
  crop_type: string;
  machinery_access: boolean;
  labor_cost_per_acre: number;
  diesel_price: number;
  created_at?: string;
}

export interface DBSimulationResult {
  id?: string;
  user_id: string;
  burn_cost: number;
  sustainable_cost: number;
  subsidy_amount: number;
  co2_burned: number;
  co2_saved: number;
  net_difference: number;
  created_at?: string;
}
