"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AgentClaim } from "@/lib/token-generator/types";

interface AgentFormProps {
    values: AgentClaim;
    onChange: (field: keyof AgentClaim, value: unknown) => void;
}

export const AgentForm = React.memo(function AgentForm({
    values,
    onChange,
}: AgentFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-zinc-300">
                    Agent ID <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={values.id}
                    onChange={(e) => onChange("id", e.target.value)}
                    placeholder="agent-researcher-01"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Unique identifier for this agent
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">
                    Agent Type <span className="text-red-500">*</span>
                </Label>
                <Select
                    value={values.type}
                    onValueChange={(value) => onChange("type", value)}
                >
                    <SelectTrigger className="bg-black/50 border-zinc-800 text-zinc-100 focus:ring-blue-600/20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem
                            value="llm-autonomous"
                            className="focus:bg-zinc-800 focus:text-zinc-100"
                        >
                            LLM Autonomous
                        </SelectItem>
                        <SelectItem
                            value="software"
                            className="focus:bg-zinc-800 focus:text-zinc-100"
                        >
                            Software
                        </SelectItem>
                        <SelectItem
                            value="model-based"
                            className="focus:bg-zinc-800 focus:text-zinc-100"
                        >
                            Model-Based
                        </SelectItem>
                        <SelectItem
                            value="hybrid"
                            className="focus:bg-zinc-800 focus:text-zinc-100"
                        >
                            Hybrid
                        </SelectItem>
                        <SelectItem
                            value="rpa-bot"
                            className="focus:bg-zinc-800 focus:text-zinc-100"
                        >
                            RPA Bot
                        </SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                    The type of autonomous agent
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">
                    Operator <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={values.operator}
                    onChange={(e) => onChange("operator", e.target.value)}
                    placeholder="org:acme-corp"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Organization or entity operating this agent
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Agent Name</Label>
                <Input
                    type="text"
                    value={values.name || ""}
                    onChange={(e) =>
                        onChange("name", e.target.value || undefined)
                    }
                    placeholder="Research Assistant"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Human-readable name
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Version</Label>
                <Input
                    type="text"
                    value={values.version || ""}
                    onChange={(e) =>
                        onChange("version", e.target.value || undefined)
                    }
                    placeholder="1.0.0"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">Optional: Agent version</p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Model</Label>
                <Input
                    type="text"
                    value={values.model || ""}
                    onChange={(e) =>
                        onChange("model", e.target.value || undefined)
                    }
                    placeholder="gpt-4"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Optional: AI model identifier (for LLM agents)
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Textarea
                    value={values.description || ""}
                    onChange={(e) =>
                        onChange("description", e.target.value || undefined)
                    }
                    rows={3}
                    placeholder="Autonomous research agent for climate data analysis"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20 resize-none"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Brief description of agent purpose
                </p>
            </div>
        </div>
    );
});
