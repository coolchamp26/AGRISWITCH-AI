// ============================================
// AgriSwitch AI — Policy Service
// ============================================
// Retrieves policy data from static JSON dataset.
// This is the lightweight RAG layer — no vector DB needed.

import policiesData from '@/data/policies.json';
import type { PolicyScheme, IndianState } from '@/types';

const policies: PolicyScheme[] = policiesData as PolicyScheme[];

/**
 * Get all policies relevant to a given state.
 * Returns state-specific schemes + central government schemes.
 */
export function getPoliciesByState(state: IndianState): PolicyScheme[] {
    return policies.filter(
        (p) => p.state === state || p.state === 'Central'
    );
}

/**
 * Get a single policy by its ID.
 */
export function getPolicyById(id: string): PolicyScheme | undefined {
    return policies.find((p) => p.id === id);
}

/**
 * Get all available policies.
 */
export function getAllPolicies(): PolicyScheme[] {
    return policies;
}

/**
 * Format policy data into a structured text block for LLM consumption.
 * The LLM will summarize ONLY this provided text — no fabrication allowed.
 */
export function formatPoliciesForLLM(schemes: PolicyScheme[]): string {
    return schemes
        .map(
            (s) => `
SCHEME: ${s.name}
STATE: ${s.state}
DESCRIPTION: ${s.description}
ELIGIBILITY:
${s.eligibility.map((e) => `  - ${e}`).join('\n')}
DOCUMENTS REQUIRED:
${s.documentsRequired.map((d) => `  - ${d}`).join('\n')}
HOW TO APPLY:
${s.howToApply.map((h) => `  - ${h}`).join('\n')}
SUBSIDY: ${s.subsidyPercent}% (Max: ${s.maxAmount})
DEADLINE: ${s.deadline}
SOURCE: ${s.source}
`
        )
        .join('\n---\n');
}
