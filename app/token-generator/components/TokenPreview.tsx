"use client";

import React, { useMemo } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/shared/CodeBlock";
import { useDebouncedValidation } from "@/hooks/useDebouncedValidation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface TokenPreviewProps {
    payload: object;
    schemasLoaded: boolean;
}

export const TokenPreview = React.memo(function TokenPreview({
    payload,
    schemasLoaded,
}: TokenPreviewProps) {
    const validation = useDebouncedValidation(payload, schemasLoaded);

    const jsonString = useMemo(
        () => JSON.stringify(payload, null, 2),
        [payload],
    );

    const stats = useMemo(
        () => ({
            size: JSON.stringify(payload).length,
            capabilities:
                (payload as { capabilities?: unknown[] }).capabilities
                    ?.length || 0,
        }),
        [payload],
    );

    return (
        <div className="space-y-4">
            {/* Removed max-h and overflow to show full content as requested */}
            <div className="rounded-md bg-black/50">
                <CodeBlock code={jsonString} language="json" showLineNumbers />
            </div>

            {/* Validation Status */}
            {!schemasLoaded ? (
                <Alert
                    variant="info"
                    className="bg-blue-900/20 text-blue-200 border-none"
                >
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                    <AlertTitle>Loading Schemas...</AlertTitle>
                    <AlertDescription>
                        Initializing AAP validation schemas
                    </AlertDescription>
                </Alert>
            ) : validation.valid ? (
                <Alert
                    variant="success"
                    className="bg-green-900/20 text-green-200 border-none"
                >
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <AlertTitle>Valid AAP Token</AlertTitle>
                    <AlertDescription>
                        This token conforms to the AAP specification
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert
                    variant="destructive"
                    className="bg-red-900/20 text-red-200 border-none"
                >
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                        <ul className="mt-1 space-y-1">
                            {validation.errors.map((err, idx) => (
                                <li key={idx}>
                                    &bull; {err.message}
                                    {err.path && (
                                        <span className="text-xs ml-1">
                                            ({err.path})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats */}
            <Separator className="bg-zinc-800" />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="text-zinc-500">Payload Size:</span>
                    <span className="ml-2 font-mono text-zinc-300">
                        {stats.size} bytes
                    </span>
                </div>
                <div>
                    <span className="text-zinc-500">Capabilities:</span>
                    <span className="ml-2 font-mono text-zinc-300">
                        {stats.capabilities}
                    </span>
                </div>
            </div>
        </div>
    );
});
