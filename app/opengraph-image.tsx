import { ImageResponse } from "next/og";

export const alt = "Agent Authorization Profile (AAP)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e1b4b 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 60,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 40,
                    }}
                >
                    <span
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "white",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        AAP
                    </span>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: 52,
                        fontWeight: 700,
                        color: "white",
                        textAlign: "center",
                        lineHeight: 1.2,
                        marginBottom: 20,
                    }}
                >
                    Agent Authorization Profile
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: 28,
                        color: "#94a3b8",
                        textAlign: "center",
                        lineHeight: 1.4,
                    }}
                >
                    OAuth 2.0 for Autonomous AI Agents
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 120,
                        height: 3,
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        borderRadius: 2,
                        marginTop: 40,
                        marginBottom: 40,
                    }}
                />

                {/* Features */}
                <div
                    style={{
                        display: "flex",
                        gap: 40,
                        color: "#cbd5e1",
                        fontSize: 18,
                    }}
                >
                    <span>Identity</span>
                    <span style={{ color: "#64748b" }}>|</span>
                    <span>Capabilities</span>
                    <span style={{ color: "#64748b" }}>|</span>
                    <span>Delegation</span>
                    <span style={{ color: "#64748b" }}>|</span>
                    <span>Oversight</span>
                </div>
            </div>
        ),
        { ...size },
    );
}
