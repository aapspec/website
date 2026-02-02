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
import { TaskClaim } from "@/lib/token-generator/types";

interface TaskFormProps {
    values: TaskClaim;
    onChange: (field: keyof TaskClaim, value: unknown) => void;
}

const PRIORITY_PLACEHOLDER = "__none__";

export const TaskForm = React.memo(function TaskForm({
    values,
    onChange,
}: TaskFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-zinc-300">
                    Task ID <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={values.id}
                    onChange={(e) => onChange("id", e.target.value)}
                    placeholder="task-research-001"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Unique identifier for this task
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">
                    Purpose <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={values.purpose}
                    onChange={(e) => onChange("purpose", e.target.value)}
                    placeholder="research_climate_data"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    The goal or purpose of this task
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Created By</Label>
                <Input
                    type="text"
                    value={values.created_by || ""}
                    onChange={(e) =>
                        onChange("created_by", e.target.value || undefined)
                    }
                    placeholder="user:alice"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Who created this task
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Priority</Label>
                <Select
                    value={values.priority || PRIORITY_PLACEHOLDER}
                    onValueChange={(value) =>
                        onChange(
                            "priority",
                            value === PRIORITY_PLACEHOLDER ? undefined : value,
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
                    Optional: Task priority level
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Category</Label>
                <Input
                    type="text"
                    value={values.category || ""}
                    onChange={(e) =>
                        onChange("category", e.target.value || undefined)
                    }
                    placeholder="research"
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Task category or type
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Input Context</Label>
                <Textarea
                    value={values.input_context || ""}
                    onChange={(e) =>
                        onChange("input_context", e.target.value || undefined)
                    }
                    rows={3}
                    placeholder="Research latest climate data for 2025..."
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20 resize-none"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Context or input for the task
                </p>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-300">Expected Output</Label>
                <Textarea
                    value={values.expected_output || ""}
                    onChange={(e) =>
                        onChange("expected_output", e.target.value || undefined)
                    }
                    rows={3}
                    placeholder="Summary report with key findings..."
                    className="bg-black/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 focus:ring-blue-600/20 resize-none"
                />
                <p className="text-xs text-zinc-500">
                    Optional: Expected result or deliverable
                </p>
            </div>
        </div>
    );
});
