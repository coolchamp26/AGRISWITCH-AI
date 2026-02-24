// ============================================
// AgriSwitch AI — AI Service (LLM Integration)
// ============================================
// This module wraps OpenAI API calls. It ONLY explains
// pre-calculated numbers — it never generates new calculations.

import type { SimulationResult, Language, DraftType } from '@/types';

/**
 * Call the AI explanation API route.
 * Sends deterministic calculation results to the LLM for plain-language explanation.
 */
export async function getAIExplanation(
    result: SimulationResult,
    language: Language
): Promise<string> {
    const response = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, language }),
    });

    if (!response.ok) {
        throw new Error('Failed to get AI explanation');
    }

    const data = await response.json();
    return data.explanation;
}

/**
 * Call the AI policy summary API route.
 * Sends static policy text for summarization — LLM must not invent new schemes.
 */
export async function getAIPolicySummary(
    state: string,
    language: Language
): Promise<string> {
    const response = await fetch('/api/ai-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, language }),
    });

    if (!response.ok) {
        throw new Error('Failed to get policy summary');
    }

    const data = await response.json();
    return data.summary;
}

/**
 * Call the AI application draft API route.
 * Generates a formal subsidy application or bank loan request letter.
 */
export async function getAIApplicationDraft(
    userName: string,
    userEmail: string,
    state: string,
    landSizeAcres: number,
    cropType: string,
    result: SimulationResult,
    draftType: DraftType,
    language: Language
): Promise<string> {
    const response = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName,
            userEmail,
            state,
            landSizeAcres,
            cropType,
            result,
            draftType,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate application draft');
    }

    const data = await response.json();
    return data.draft;
}
