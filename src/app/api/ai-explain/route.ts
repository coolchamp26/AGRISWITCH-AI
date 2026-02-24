// ============================================
// AgriSwitch AI — AI Explanation API Route
// ============================================
// Receives pre-calculated deterministic data and asks GPT to explain it.
// The LLM NEVER generates new numbers — only explains provided values.

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { result, language } = await req.json();

        const langInstruction = language === 'hi'
            ? 'Respond in simple Hindi mixed with English technical terms (Hinglish). Use Devanagari script for Hindi words.'
            : 'Respond in simple, clear English suitable for Indian farmers.';

        const prompt = `You are an agricultural economics advisor helping Indian farmers understand crop residue management economics.

STRICT RULES:
1. Do NOT fabricate, invent, or calculate any new numbers.
2. ONLY explain and interpret the numbers provided below.
3. Use simple language a farmer can understand.
4. Highlight both short-term costs and long-term benefits.
5. Frame environmental impact positively.
6. ${langInstruction}

Here are the PRE-CALCULATED results for a ${result.farmProfile.landSizeAcres}-acre ${result.farmProfile.cropType} farm in ${result.farmProfile.state}:

BURNING SCENARIO:
- Total crop residue: ${result.burn.totalResidue} tons
- CO₂ emissions from burning: ${result.burn.totalCO2} tons
- Immediate cost (labor for burning): ₹${result.burn.immediateCost}
- Health & legal risks: ${result.burn.healthPenalty}

SUSTAINABLE SCENARIO:
- Machinery cost: ₹${result.sustainable.machineryCost}
- Government subsidy: ₹${result.sustainable.subsidyAmount}
- Net cost after subsidy: ₹${result.sustainable.netCost}
- CO₂ saved: ${result.sustainable.co2Saved} tons
- Carbon credit potential: ₹${result.sustainable.carbonCreditValue}
- Yield improvement: ${result.sustainable.yieldBenefitPercent}% over 3 seasons (worth ₹${result.sustainable.yieldBenefitValue})

COMPARISON:
- Net cost difference: ₹${result.netDifference}
- Environmental equivalent: ${result.treesEquivalent} trees planted, ${result.carsRemovedEquivalent} cars removed from roads

Please provide:
1. A brief summary comparing both options (2-3 sentences)
2. Short-term cost analysis (what farmer pays today)
3. Long-term benefit analysis (3-season projection)
4. Environmental impact explanation
5. Clear recommendation with reasoning

Format with clear headers and bullet points.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful agricultural advisor. You MUST only explain the numbers provided to you. NEVER invent new statistics or calculations.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });

        const explanation = completion.choices[0]?.message?.content || 'Unable to generate explanation.';

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('AI Explanation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI explanation. Please try again.' },
            { status: 500 }
        );
    }
}
