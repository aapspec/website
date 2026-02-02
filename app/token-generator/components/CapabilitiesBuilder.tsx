"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ConstraintsBuilder } from "./ConstraintsBuilder";
import { Plus, Trash2 } from "lucide-react";
import { CapabilityClaim } from "@/lib/token-generator/types";

interface CapabilitiesBuilderProps {
    capabilities: CapabilityClaim[];
    onChange: (capabilities: CapabilityClaim[]) => void;
}

const PRIORITY_PLACEHOLDER = "__none__";

export const CapabilitiesBuilder = React.memo(function CapabilitiesBuilder({
    capabilities,
    onChange,
}: CapabilitiesBuilderProps) {
    const addCapability = () => {
        onChange([...capabilities, { action: "", constraints: {} }]);
    };

    const removeCapability = (index: number) => {
        onChange(capabilities.filter((_, i) => i !== index));
    };

    const updateCapability = (
        index: number,
        field: keyof CapabilityClaim,
        value: unknown,
    ) => {
        const updated = [...capabilities];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const updateResources = (index: number, value: string) => {
        const resources = value
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r);
        updateCapability(
            index,
            "resources",
            resources.length > 0 ? resources : undefined,
        );
    };

    return (
        <div className="space-y-4">
            {capabilities.length === 0 && (
                <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-lg bg-black/20">
                    No capabilities defined. Add at least one capability.
                </div>
            )}

            {capabilities.map((cap, idx) => (
                <Card
                    key={idx}
                    className="bg-black/40 border-zinc-800 shadow-sm"
                >
                    <CardContent className="pt-6 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-zinc-100">
                                Capability #{idx + 1}
                            </h4>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCapability(idx)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                                <Trash2 className="h-4 w-4" />
                                Remove
                            </Button>
                        </div>

                        {/* Action */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">
                                Action <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                value={cap.action}
                                onChange={(e) =>
                                    updateCapability(
                                        idx,
                                        "action",
                                        e.target.value,
                                    )
                                }
                                placeholder="search.web"
                                className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            />
                            <p className="text-xs text-zinc-500">
                                The action or operation this capability permits
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Description</Label>
                            <Input
                                type="text"
                                value={cap.description || ""}
                                onChange={(e) =>
                                    updateCapability(
                                        idx,
                                        "description",
                                        e.target.value || undefined,
                                    )
                                }
                                placeholder="Search web resources within allowed domains"
                                className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            />
                            <p className="text-xs text-zinc-500">
                                Optional: Explain what this capability allows
                            </p>
                        </div>

                        {/* Resources */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Resources</Label>
                            <Input
                                type="text"
                                value={cap.resources?.join(", ") || ""}
                                onChange={(e) =>
                                    updateResources(idx, e.target.value)
                                }
                                placeholder="/api/v1/search, /api/v1/data"
                                className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                            />
                            <p className="text-xs text-zinc-500">
                                Optional: Comma-separated list of specific
                                resources
                            </p>
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Priority</Label>
                            <Select
                                value={cap.priority || PRIORITY_PLACEHOLDER}
                                onValueChange={(value) =>
                                    updateCapability(
                                        idx,
                                        "priority",
                                        value === PRIORITY_PLACEHOLDER
                                            ? undefined
                                            : value,
                                    )
                                }
                            >
                                <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-100 focus:ring-blue-600/20">
                                    <SelectValue placeholder="Not specified" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                    <SelectItem
                                        value={PRIORITY_PLACEHOLDER}
                                        className="focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        Not specified
                                    </SelectItem>
                                    <SelectItem
                                        value="low"
                                        className="focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        Low
                                    </SelectItem>
                                    <SelectItem
                                        value="medium"
                                        className="focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        Medium
                                    </SelectItem>
                                    <SelectItem
                                        value="high"
                                        className="focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        High
                                    </SelectItem>
                                    <SelectItem
                                        value="critical"
                                        className="focus:bg-zinc-800 focus:text-zinc-100"
                                    >
                                        Critical
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-zinc-500">
                                Optional: Priority level
                            </p>
                        </div>

                        {/* Constraints */}
                        <ConstraintsBuilder
                            constraints={cap.constraints || {}}
                            onChange={(newConstraints) =>
                                updateCapability(
                                    idx,
                                    "constraints",
                                    newConstraints,
                                )
                            }
                        />
                    </CardContent>
                </Card>
            ))}

            {/* Add Button */}
            <Button
                variant="outline"
                onClick={addCapability}
                className="w-full bg-black/20 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
                <Plus className="h-4 w-4" />
                Add Capability
            </Button>
        </div>
    );
});
