import { Hero } from "@/components/landing/Hero";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { SolutionFeatures } from "@/components/landing/SolutionFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { Benefits } from "@/components/landing/Benefits";
import { CodeExample } from "@/components/landing/CodeExample";
import { CallToAction } from "@/components/landing/CallToAction";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <ProblemStatement />
            <SolutionFeatures />
            <HowItWorks />
            <UseCases />
            <Benefits />
            <CodeExample />
            <CallToAction />
        </main>
    );
}
