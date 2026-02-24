'use client';

import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-green-950 border-t border-green-800/50 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-green-400 font-semibold text-sm">AgriSwitch AI</p>
                        <p className="text-green-600 text-xs mt-1">
                            AI-Powered Crop Residue Decision Intelligence System
                        </p>
                    </div>
                    <div className="text-center md:text-right">
                        <p className="text-green-500 text-xs">
                            ⚠️ Estimates are based on predefined calculation factors.
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                            Actual scheme values may differ. Consult your local agriculture office.
                        </p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-800/30 text-center">
                    <p className="text-green-700 text-xs">
                        Built for Hack4Green Hackathon — Promoting Sustainable Agriculture in India 🌾
                    </p>
                </div>
            </div>
        </footer>
    );
}
