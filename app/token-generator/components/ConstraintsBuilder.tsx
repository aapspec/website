"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { ConstraintsClaim } from "@/lib/token-generator/types";

interface ConstraintsBuilderProps {
    constraints: ConstraintsClaim;
    onChange: (constraints: ConstraintsClaim) => void;
}

export const ConstraintsBuilder = React.memo(function ConstraintsBuilder({
    constraints,
    onChange,
}: ConstraintsBuilderProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const updateConstraint = (
        field: keyof ConstraintsClaim,
        value: unknown,
    ) => {
        onChange({ ...constraints, [field]: value });
    };

    const updateDomains = (
        field: "domains_allowed" | "domains_blocked",
        value: string,
    ) => {
        const domains = value
            .split(",")
            .map((d) => d.trim())
            .filter((d) => d);
        updateConstraint(field, domains.length > 0 ? domains : undefined);
    };

    return (
        <div className="space-y-4 p-4 rounded-lg border border-zinc-800 bg-black/20">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-zinc-300">
                    Constraints
                </h4>
            </div>

            {/* Rate Limits */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">
                        Max Requests/Hour
                    </Label>
                    <Input
                        type="number"
                        min="0"
                        value={constraints.max_requests_per_hour || ""}
                        onChange={(e) =>
                            updateConstraint(
                                "max_requests_per_hour",
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            )
                        }
                        className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                        placeholder="100"
                    />
                    <p className="text-xs text-zinc-500">
                        Leave empty for unlimited
                    </p>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">
                        Max Requests/Minute
                    </Label>
                    <Input
                        type="number"
                        min="0"
                        value={constraints.max_requests_per_minute || ""}
                        onChange={(e) =>
                            updateConstraint(
                                "max_requests_per_minute",
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                            )
                        }
                        className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                        placeholder="10"
                    />
                    <p className="text-xs text-zinc-500">
                        Leave empty for unlimited
                    </p>
                </div>
            </div>

            {/* Domain Constraints */}
            <div className="space-y-2">
                <Label className="text-xs text-zinc-400">Allowed Domains</Label>
                <Input
                    type="text"
                    value={constraints.domains_allowed?.join(", ") || ""}
                    onChange={(e) =>
                        updateDomains("domains_allowed", e.target.value)
                    }
                    className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                    placeholder="example.org, trusted.com"
                />
                <p className="text-xs text-zinc-500">
                    Comma-separated list (e.g., example.org, trusted.com)
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-xs text-zinc-400">Blocked Domains</Label>
                <Input
                    type="text"
                    value={constraints.domains_blocked?.join(", ") || ""}
                    onChange={(e) =>
                        updateDomains("domains_blocked", e.target.value)
                    }
                    className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                    placeholder="malicious.com, spam.net"
                />
                <p className="text-xs text-zinc-500">Comma-separated list</p>
            </div>

            {/* Advanced Constraints */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    <ChevronsUpDown className="h-3 w-3" />
                    {showAdvanced ? "Hide" : "Show"} Advanced
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-3">
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">
                            Max Requests/Day
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={constraints.max_requests_per_day || ""}
                            onChange={(e) =>
                                updateConstraint(
                                    "max_requests_per_day",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                )
                            }
                            className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            placeholder="1000"
                        />
                        <p className="text-xs text-zinc-500">Daily limit</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">
                            Max Cost (USD)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={constraints.max_cost_usd || ""}
                            onChange={(e) =>
                                updateConstraint(
                                    "max_cost_usd",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                )
                            }
                            className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            placeholder="10.00"
                        />
                        <p className="text-xs text-zinc-500">
                            Maximum cost in dollars
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">
                            Max File Size (MB)
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={constraints.max_file_size_mb || ""}
                            onChange={(e) =>
                                updateConstraint(
                                    "max_file_size_mb",
                                    e.target.value
                                        ? Number(e.target.value)
                                        : undefined,
                                )
                            }
                            className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            placeholder="100"
                        />
                        <p className="text-xs text-zinc-500">
                            Maximum upload size
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">
                            Allowed HTTP Methods
                        </Label>
                        <Input
                            type="text"
                            value={
                                constraints.allowed_methods?.join(", ") || ""
                            }
                            onChange={(e) => {
                                const methods = e.target.value
                                    .split(",")
                                    .map((m) => m.trim())
                                    .filter((m) => m);
                                updateConstraint(
                                    "allowed_methods",
                                    methods.length > 0 ? methods : undefined,
                                );
                            }}
                            className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            placeholder="GET, POST"
                        />
                        <p className="text-xs text-zinc-500">
                            Comma-separated (GET, POST, etc.)
                        </p>
                    </div>

                    {/* Time Window */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-400">
                            Time Window (UTC)
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">
                                    Start
                                </Label>
                                <Input
                                    type="time"
                                    step="1"
                                    value={
                                        constraints.time_window?.start?.replace(
                                            "Z",
                                            "",
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        updateConstraint("time_window", {
                                            ...constraints.time_window,
                                            start: e.target.value
                                                ? `${e.target.value}Z`
                                                : undefined,
                                        })
                                    }
                                    className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-zinc-500">
                                    End
                                </Label>
                                <Input
                                    type="time"
                                    step="1"
                                    value={
                                        constraints.time_window?.end?.replace(
                                            "Z",
                                            "",
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        updateConstraint("time_window", {
                                            ...constraints.time_window,
                                            end: e.target.value
                                                ? `${e.target.value}Z`
                                                : undefined,
                                        })
                                    }
                                    className="h-8 text-sm bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                                />
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
});
