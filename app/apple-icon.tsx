import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 180,
                    height: 180,
                    borderRadius: 36,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        fontSize: 64,
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    AAP
                </span>
            </div>
        ),
        { ...size },
    );
}
