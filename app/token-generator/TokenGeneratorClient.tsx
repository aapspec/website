"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BasicClaimsForm } from "./components/BasicClaimsForm";
import { AgentForm } from "./components/AgentForm";
import { TaskForm } from "./components/TaskForm";
import { CapabilitiesBuilder } from "./components/CapabilitiesBuilder";
import { TokenPreview } from "./components/TokenPreview";
import { TokenOutput } from "./components/TokenOutput";
import { templates } from "@/lib/token-generator/templates";
import { useTokenForm } from "@/hooks/useTokenForm";
import { useSchemas } from "@/hooks/useSchemas";
import {
    Loader2,
    Lock,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

const TEMPLATE_PLACEHOLDER = "__none__";

const STEPS = {
    BASIC: "basic",
    AGENT: "agent",
    TASK: "task",
    CAPABILITIES: "capabilities",
    SIGN: "sign",
};

const STEP_ORDER = [
    STEPS.BASIC,
    STEPS.AGENT,
    STEPS.TASK,
    STEPS.CAPABILITIES,
    STEPS.SIGN,
];

export function TokenGeneratorClient() {
    const {
        state,
        outputRef,
        updateField,
        updateAgentField,
        updateTaskField,
        setCapabilities,
        loadTemplate,
        setSecretKey,
        updateTimestamps,
        generateToken,
    } = useTokenForm();

    const { schemasLoaded } = useSchemas();
    const [currentStep, setCurrentStep] = useState(STEPS.BASIC);

    useEffect(() => {
        updateTimestamps();
    }, [updateTimestamps]);

    const handleNext = () => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
            setCurrentStep(STEP_ORDER[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = STEP_ORDER.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEP_ORDER[currentIndex - 1]);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-7 space-y-6">
                {/* Header / Template Selector */}
                <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl p-6 shadow-sm border-0 ring-1 ring-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-white">
                                Token Configuration
                            </h2>
                            <p className="text-sm text-zinc-400 mt-1">
                                Customize your AAP token claims step-by-step
                            </p>
                        </div>
                        <div className="w-full md:w-[220px]">
                            <Select
                                value={TEMPLATE_PLACEHOLDER}
                                onValueChange={(value) => {
                                    if (value !== TEMPLATE_PLACEHOLDER) {
                                        loadTemplate(value);
                                        // Optional: Reset to first step on template load?
                                        setCurrentStep(STEPS.BASIC);
                                    }
                                }}
                            >
                                <SelectTrigger className="bg-black/20 border-zinc-800 text-zinc-300 focus:ring-zinc-700">
                                    <SelectValue placeholder="Load template..." />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                    <SelectItem
                                        value={TEMPLATE_PLACEHOLDER}
                                        disabled
                                    >
                                        Load template...
                                    </SelectItem>
                                    {Object.entries(templates).map(
                                        ([key, tpl]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="focus:bg-zinc-800 focus:text-white"
                                            >
                                                {tpl.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Wizard Accordion */}
                <div className="space-y-4">
                    <Accordion
                        type="single"
                        collapsible
                        value={currentStep}
                        onValueChange={(val) => val && setCurrentStep(val)}
                        className="space-y-4 border-none"
                    >
                        {/* 1. Basic Information */}
                        <AccordionItem
                            value={STEPS.BASIC}
                            className="bg-zinc-900/40 backdrop-blur-md border-0 rounded-xl px-2 shadow-sm overflow-hidden data-[state=open]:bg-zinc-900/60 transition-all duration-300 ring-1 ring-white/5"
                        >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 rounded-lg transition-colors py-5 border-none">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-0 text-sm font-bold transition-all shadow-lg ${currentStep === STEPS.BASIC ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-zinc-800 text-zinc-500"}`}
                                    >
                                        1
                                    </div>
                                    <div className="text-left">
                                        <div
                                            className={`font-semibold text-lg ${currentStep === STEPS.BASIC ? "text-white" : "text-zinc-400"}`}
                                        >
                                            Basic Information
                                        </div>
                                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                                            Standard JWT claims and timing
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 px-6 pb-6 border-none">
                                <div className="space-y-6">
                                    <BasicClaimsForm
                                        values={state.payload}
                                        onChange={updateField}
                                    />
                                    <div className="flex justify-end pt-6 border-t border-white/5">
                                        <Button
                                            onClick={handleNext}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                                        >
                                            Next Step{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. Agent Identity */}
                        <AccordionItem
                            value={STEPS.AGENT}
                            className="bg-zinc-900/40 backdrop-blur-md border-0 rounded-xl px-2 shadow-sm overflow-hidden data-[state=open]:bg-zinc-900/60 transition-all duration-300 ring-1 ring-white/5"
                        >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 rounded-lg transition-colors py-5 border-none">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-0 text-sm font-bold transition-all shadow-lg ${currentStep === STEPS.AGENT ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-zinc-800 text-zinc-500"}`}
                                    >
                                        2
                                    </div>
                                    <div className="text-left">
                                        <div
                                            className={`font-semibold text-lg ${currentStep === STEPS.AGENT ? "text-white" : "text-zinc-400"}`}
                                        >
                                            Agent Identity
                                        </div>
                                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                                            Who is requesting this token?
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 px-6 pb-6 border-none">
                                <div className="space-y-6">
                                    <AgentForm
                                        values={state.payload.agent}
                                        onChange={updateAgentField}
                                    />
                                    <div className="flex justify-between pt-6 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            <ArrowLeft className="h-4 w-4" />{" "}
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                                        >
                                            Next Step{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 3. Task Context */}
                        <AccordionItem
                            value={STEPS.TASK}
                            className="bg-zinc-900/40 backdrop-blur-md border-0 rounded-xl px-2 shadow-sm overflow-hidden data-[state=open]:bg-zinc-900/60 transition-all duration-300 ring-1 ring-white/5"
                        >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 rounded-lg transition-colors py-5 border-none">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-0 text-sm font-bold transition-all shadow-lg ${currentStep === STEPS.TASK ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-zinc-800 text-zinc-500"}`}
                                    >
                                        3
                                    </div>
                                    <div className="text-left">
                                        <div
                                            className={`font-semibold text-lg ${currentStep === STEPS.TASK ? "text-white" : "text-zinc-400"}`}
                                        >
                                            Task Context
                                        </div>
                                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                                            What task is being performed?
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 px-6 pb-6 border-none">
                                <div className="space-y-6">
                                    <TaskForm
                                        values={state.payload.task}
                                        onChange={updateTaskField}
                                    />
                                    <div className="flex justify-between pt-6 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            <ArrowLeft className="h-4 w-4" />{" "}
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                                        >
                                            Next Step{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 4. Capabilities */}
                        <AccordionItem
                            value={STEPS.CAPABILITIES}
                            className="bg-zinc-900/40 backdrop-blur-md border-0 rounded-xl px-2 shadow-sm overflow-hidden data-[state=open]:bg-zinc-900/60 transition-all duration-300 ring-1 ring-white/5"
                        >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 rounded-lg transition-colors py-5 border-none">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-0 text-sm font-bold transition-all shadow-lg ${currentStep === STEPS.CAPABILITIES ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-zinc-800 text-zinc-500"}`}
                                    >
                                        4
                                    </div>
                                    <div className="text-left">
                                        <div
                                            className={`font-semibold text-lg ${currentStep === STEPS.CAPABILITIES ? "text-white" : "text-zinc-400"}`}
                                        >
                                            Capabilities
                                        </div>
                                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                                            Define allowed actions
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 px-6 pb-6 border-none">
                                <div className="space-y-6">
                                    <CapabilitiesBuilder
                                        capabilities={
                                            state.payload.capabilities
                                        }
                                        onChange={setCapabilities}
                                    />
                                    <div className="flex justify-between pt-6 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            <ArrowLeft className="h-4 w-4" />{" "}
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                                        >
                                            Review & Sign{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 5. Sign & Generate */}
                        <AccordionItem
                            value={STEPS.SIGN}
                            className="bg-zinc-900/40 backdrop-blur-md border-0 rounded-xl px-2 shadow-sm overflow-hidden data-[state=open]:bg-zinc-900/60 transition-all duration-300 ring-1 ring-white/5"
                        >
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-white/5 rounded-lg transition-colors py-5 border-none">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full border-0 text-sm font-bold transition-all shadow-lg ${currentStep === STEPS.SIGN ? "bg-green-500 text-white shadow-green-500/20" : "bg-zinc-800 text-zinc-500"}`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <div
                                            className={`font-semibold text-lg ${currentStep === STEPS.SIGN ? "text-white" : "text-zinc-400"}`}
                                        >
                                            Review & Sign
                                        </div>
                                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                                            Finalize and generate token
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 px-6 pb-6 border-none">
                                <div className="space-y-6">
                                    <div className="bg-black/40 p-5 rounded-xl space-y-4 border border-zinc-800">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="secret-key"
                                                className="text-zinc-300"
                                            >
                                                Signing Secret (HS256)
                                            </Label>
                                            <p className="text-xs text-zinc-500">
                                                Enter a secret key to sign your
                                                token. In production, use a
                                                secure key management system.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="secret-key"
                                                type="password"
                                                value={state.secretKey}
                                                onChange={(e) =>
                                                    setSecretKey(e.target.value)
                                                }
                                                className="font-mono text-sm pr-10 bg-black/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-700 focus:ring-zinc-700"
                                                placeholder="your-secret-key"
                                            />
                                            <Lock className="absolute right-3 top-2.5 h-4 w-4 text-zinc-600" />
                                        </div>
                                    </div>

                                    {state.error && (
                                        <Alert
                                            variant="destructive"
                                            className="animate-in slide-in-from-top-2 border-red-900/50 bg-red-900/20 text-red-200"
                                        >
                                            <AlertCircle className="h-4 w-4 text-red-400" />
                                            <AlertDescription>
                                                <strong>Error:</strong>{" "}
                                                {state.error}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="flex justify-between pt-6 border-t border-white/5 items-center">
                                        <Button
                                            variant="ghost"
                                            onClick={handleBack}
                                            className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            <ArrowLeft className="h-4 w-4" />{" "}
                                            Back
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                generateToken(schemasLoaded)
                                            }
                                            disabled={
                                                state.loading || !schemasLoaded
                                            }
                                            size="lg"
                                            className="min-w-[160px] shadow-xl shadow-green-500/20 hover:shadow-green-500/30 transition-all bg-green-600 hover:bg-green-700 text-white border-0"
                                        >
                                            {!schemasLoaded ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Loading Schemas...
                                                </>
                                            ) : state.loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>Generate Token</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 text-zinc-100">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-base font-semibold text-white">
                        Live Preview
                    </h3>
                    <span className="text-xs font-normal text-muted-foreground bg-zinc-900/50 border border-zinc-800 px-2 py-1 rounded">
                        Real-time
                    </span>
                </div>

                {state.generatedToken ? (
                    <div
                        ref={outputRef}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <TokenOutput
                            token={state.generatedToken}
                            secretKey={state.secretKey}
                        />
                        <div className="mt-4 flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateToken(schemasLoaded)}
                                className="text-xs border-zinc-800 bg-black/50 text-zinc-300 hover:bg-zinc-900 hover:text-white"
                            >
                                Regenerate
                            </Button>
                        </div>
                    </div>
                ) : (
                    <TokenPreview
                        payload={state.payload}
                        schemasLoaded={schemasLoaded}
                    />
                )}
            </div>
        </div>
    );
}
