/**
 * Token Generator Page - Interactive AAP JWT Token Builder
 */

import { TokenGeneratorClient } from "./TokenGeneratorClient";

export const metadata = {
    title: "AAP Token Generator - Interactive JWT Builder",
    description:
        "Generate and validate Agent Authorization Profile (AAP) JWT tokens compatible with jwt.io",
};

export default function TokenGeneratorPage() {
    // Schemas are now loaded client-side via API

    return (
        <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/10">
            {/* Aurora Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-[100px] rounded-full mix-blend-screen animate-in fade-in zoom-in duration-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
                        Now with Schema Validation
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground text-balance animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
                        AAP Token Generator
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                        Generate compliant Agent Authorization Profile JWT
                        tokens with real-time validation and jwt.io
                        compatibility.
                    </p>

                    {/* Quick Info */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300">
                        {[
                            {
                                title: "OAuth 2.0",
                                desc: "Built on standards",
                                color: "text-blue-500",
                            },
                            {
                                title: "Schema Validated",
                                desc: "Real-time checks",
                                color: "text-green-500",
                            },
                            {
                                title: "jwt.io Ready",
                                desc: "Fully compatible",
                                color: "text-purple-500",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group p-6 bg-card/50 backdrop-blur-sm border rounded-xl hover:bg-card/80 transition-all hover:shadow-lg"
                            >
                                <div
                                    className={`text-2xl font-bold ${item.color} mb-2 group-hover:scale-105 transition-transform`}
                                >
                                    {item.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {item.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Component */}
                <div className="animate-in slide-in-from-bottom-12 fade-in duration-700 delay-500">
                    <TokenGeneratorClient />
                </div>
            </div>
        </div>
    );
}
