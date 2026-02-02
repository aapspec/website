"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/shared/DateTimePicker";

interface BasicClaimsFormProps {
    values: {
        iss: string;
        sub: string;
        aud: string | string[];
        exp: number;
        iat: number;
        nbf?: number;
        jti?: string;
    };
    onChange: (field: string, value: unknown) => void;
}

export const BasicClaimsForm = React.memo(function BasicClaimsForm({
    values,
    onChange,
}: BasicClaimsFormProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label className="flex items-center gap-2 text-zinc-300">
                    Issuer (iss) <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="url"
                    value={values.iss}
                    onChange={(e) => onChange("iss", e.target.value)}
                    placeholder="https://as.example.com"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-[0.8rem] text-zinc-500">
                    The authorization server that issued this token
                </p>
            </div>

            <div className="grid gap-2">
                <Label className="text-zinc-300">
                    Subject (sub) <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={values.sub}
                    onChange={(e) => onChange("sub", e.target.value)}
                    placeholder="agent-researcher-01"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-[0.8rem] text-zinc-500">
                    The agent identifier that this token represents
                </p>
            </div>

            <div className="grid gap-2">
                <Label className="text-zinc-300">
                    Audience (aud) <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={
                        Array.isArray(values.aud)
                            ? values.aud.join(", ")
                            : values.aud
                    }
                    onChange={(e) => {
                        const value = e.target.value;
                        onChange(
                            "aud",
                            value.includes(",")
                                ? value.split(",").map((s) => s.trim())
                                : value,
                        );
                    }}
                    placeholder="https://api.example.com"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-[0.8rem] text-zinc-500">
                    The API or service that should accept this token
                </p>
            </div>

            {/* Timestamps & JTI - Vertical Stack for better alignment */}
            <div className="space-y-4 pt-2">
                <DateTimePicker
                    label="Issued At (iat)"
                    value={values.iat}
                    onChange={(ts) => onChange("iat", ts)}
                    required
                    hint="When this token was created"
                />

                <DateTimePicker
                    label="Expires (exp)"
                    value={values.exp}
                    onChange={(ts) => onChange("exp", ts)}
                    required
                    hint="When this token becomes invalid"
                />

                <div className="space-y-2">
                    <Label className="text-zinc-300">Not Before (nbf)</Label>
                    <DateTimePicker
                        label=""
                        value={values.nbf || values.iat}
                        onChange={(ts) => onChange("nbf", ts)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-zinc-300">JWT ID (jti)</Label>
                    <Input
                        type="text"
                        value={values.jti || ""}
                        onChange={(e) =>
                            onChange("jti", e.target.value || undefined)
                        }
                        placeholder="Unique ID"
                        className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                    />
                </div>
            </div>
        </div>
    );
});
