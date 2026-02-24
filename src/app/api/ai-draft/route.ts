// ============================================
// AgriSwitch AI — Application Draft API Route
// ============================================
// Generates formal application letters using user data and scheme info.
// The LLM creates the letter format but uses only provided data.

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPoliciesByState, formatPoliciesForLLM } from '@/services/policyService';
import type { IndianState } from '@/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { userName, userEmail, state, landSizeAcres, cropType, result, draftType, language } =
            await req.json();

        const policies = getPoliciesByState(state as IndianState);
        const policyText = formatPoliciesForLLM(policies);

        const langInstruction = language === 'hi'
            ? 'Write the letter in formal Hindi with English technical terms where needed.'
            : 'Write the letter in formal English.';

        let draftPrompt = '';

        if (draftType === 'subsidy') {
            draftPrompt = `Generate a formal subsidy application letter for the Crop Residue Management (CRM) scheme.

APPLICANT DETAILS:
- Name: ${userName || 'Farmer Name'}
- Email: ${userEmail || 'farmer@email.com'}
- State: ${state}
- Farm Size: ${landSizeAcres} acres
- Crop: ${cropType}
- Machinery Cost Required: ₹${result.sustainable.machineryCost}
- Subsidy Requested: ₹${result.sustainable.subsidyAmount}

RELEVANT SCHEME INFO:
${policyText}

${langInstruction}

The letter should:
1. Be addressed to the District Agriculture Officer
2. State the purpose clearly
3. Mention the specific scheme being applied to
4. Include farm details
5. Request the specific subsidy amount
6. Be formal and professional
7. Include a place for signature, date, and attachments list`;
        } else {
            draftPrompt = `Generate a formal bank loan application letter for purchasing crop residue management machinery.

APPLICANT DETAILS:
- Name: ${userName || 'Farmer Name'}
- Email: ${userEmail || 'farmer@email.com'}
- State: ${state}
- Farm Size: ${landSizeAcres} acres
- Crop: ${cropType}
- Machinery Cost: ₹${result.sustainable.machineryCost}
- Government Subsidy Available: ₹${result.sustainable.subsidyAmount}
- Loan Amount Requested: ₹${result.sustainable.netCost}

${langInstruction}

The letter should:
1. Be addressed to the Branch Manager
2. State the purpose (purchasing CRM machinery)
3. Mention the government subsidy that reduces repayment risk
4. Include farm details and economic viability
5. Request the specific loan amount
6. Mention willingness to provide land documents as collateral
7. Be formal and professional
8. Include a place for signature, date, and attachments list`;
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional letter writer helping Indian farmers create formal applications. Use ONLY the provided details.',
                },
                { role: 'user', content: draftPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });

        const draft = completion.choices[0]?.message?.content || 'Unable to generate draft.';

        return NextResponse.json({ draft });
    } catch (error) {
        console.error('Draft Generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate application draft. Please try again.' },
            { status: 500 }
        );
    }
}
