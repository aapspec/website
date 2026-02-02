"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { Copy, Check, ExternalLink, Download } from "lucide-react";

interface TokenOutputProps {
    token: string;
    secretKey: string;
}

export const TokenOutput = React.memo(function TokenOutput({
    token,
    secretKey,
}: TokenOutputProps) {
    const [copied, setCopied] = useState(false);

    const copyToken = useCallback(async () => {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [token]);

    const openInJwtIo = useCallback(() => {
        const url = `https://jwt.io/#debugger-io?token=${encodeURIComponent(token)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }, [token]);

    const downloadToken = useCallback(() => {
        const blob = new Blob([token], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aap-token-${Date.now()}.jwt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [token]);

    const decoded = useMemo(() => {
        try {
            const parts = token.split(".");
            if (parts.length === 3) {
                return {
                    header: JSON.parse(atob(parts[0])),
                    payload: JSON.parse(atob(parts[1])),
                    signature: parts[2],
                };
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
        return { header: {}, payload: {}, signature: "" };
    }, [token]);

    const headerJson = useMemo(
        () => JSON.stringify(decoded.header, null, 2),
        [decoded.header],
    );
    const payloadJson = useMemo(
        () => JSON.stringify(decoded.payload, null, 2),
        [decoded.payload],
    );

    return (
        <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Generated Token</h2>

            {/* Token Display - Custom UI with Actions */}
            <div className="rounded-xl bg-zinc-900/50 backdrop-blur-md border-0 ring-1 ring-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-zinc-950/30 flex justify-between items-center">
                    <h3 className="text-base font-semibold text-white">
                        JWT Token
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyToken}
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 mr-2" />
                            ) : (
                                <Copy className="h-4 w-4 mr-2" />
                            )}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={openInJwtIo}
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in jwt.io
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={downloadToken}
                            className="text-zinc-400 hover:text-white hover:bg-white/10"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="rounded-lg border border-zinc-800 bg-black/50 p-4 overflow-x-auto">
                        <code className="text-xs font-mono break-all text-blue-400">
                            {token}
                        </code>
                    </div>

                    <Alert
                        variant="info"
                        className="bg-blue-900/10 text-blue-200 border-none"
                    >
                        <AlertDescription>
                            <strong>Note:</strong> This token is signed with a
                            demo secret key. For production use, configure your
                            own secure secret.
                        </AlertDescription>
                    </Alert>

                    <Alert
                        variant="warning"
                        className="bg-yellow-900/10 text-yellow-200 border-none"
                    >
                        <AlertDescription>
                            <p className="text-xs font-semibold mb-2 text-yellow-500">
                                Secret Key for jwt.io verification:
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 px-3 py-2 rounded border border-zinc-800 bg-black/50 text-sm font-mono text-zinc-300">
                                    {secretKey}
                                </code>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(
                                            secretKey,
                                        );
                                    }}
                                    className="shrink-0 text-zinc-400 hover:text-white"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs mt-2 text-yellow-500/80">
                                Copy this key and paste it in jwt.io&apos;s
                                &quot;Verify Signature&quot; section to verify
                                the token.
                            </p>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>

            {/* Decoded Token - Directly using CodeBlock as requested */}
            <div className="space-y-6">
                <CodeBlock
                    code={headerJson}
                    language="json"
                    filename="Header"
                />
                <CodeBlock
                    code={payloadJson}
                    language="json"
                    filename="Payload"
                />
                <CodeBlock
                    code={decoded.signature}
                    language="text"
                    filename="Signature"
                />
            </div>
        </div>
    );
});
