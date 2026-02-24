// ============================================
// AgriSwitch AI — Policy Summary API Route
// ============================================
// Summarizes ONLY the provided static policy data.
// LLM must NOT invent new schemes or fabricate eligibility criteria.

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPoliciesByState, formatPoliciesForLLM } from '@/services/policyService';
import type { IndianState } from '@/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { state, language } = await req.json();

        const policies = getPoliciesByState(state as IndianState);
        const policyText = formatPoliciesForLLM(policies);

        const langInstruction = language === 'hi'
            ? 'Respond in simple Hindi mixed with English technical terms (Hinglish). Use Devanagari script for Hindi words.'
            : 'Respond in simple, clear English suitable for Indian farmers.';

        const prompt = `You are a government scheme advisor helping Indian farmers understand crop residue management subsidies.

STRICT RULES:
1. Summarize ONLY the policy information provided below.
2. Do NOT invent any new scheme, subsidy amount, or eligibility criteria.
3. If information is not in the provided data, say "Information not available in our records."
4. ${langInstruction}

POLICY DATA FOR ${state}:
${policyText}

Please provide a clear summary for each scheme covering:
1. **Scheme Name** and brief description
2. **Who is eligible** (bullet points)
3. **Documents needed** (bullet points)
4. **How to apply** (step-by-step)
5. **Subsidy amount** and deadline
6. **Important tip** for the farmer

Format clearly with headers for each scheme.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an agricultural policy assistant. Summarize policy details clearly and accurately. NEVER fabricate numbers.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.1,
        });

        const summary = completion.choices[0]?.message?.content || 'Scheme details are being retrieved from the static database.';

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error('AI Policy error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate policy summary',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
