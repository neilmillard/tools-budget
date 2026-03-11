import React from 'react';
import {PostIt} from "@/app/components/ui/PostIt";
import {CircleNum} from "@/app/components/ui/CircleNum";

interface JourneyNavigationProps {
    currentStep?: number;
}

export const journeySteps = [
    {
        number: 1,
        titleTop: "Paying Debt",
        description: "Stop digging the hole. Learn about [Eliminating Consumer Debt](/blog/freedom-through-discipline/) and getting your spending under control.",
        href: "/journey/paying-debt/",
        color: "#ffaa66"
    },
    {
        number: 2,
        titleTop: "Saving",
        description: "Build your foundation. Create [Your Financial Safety Net](/blog/your-financial-safety-net/) and start saving for a home deposit.",
        href: "/journey/saving/",
        color: "#f7dc6f"
    },
    {
        number: 3,
        titleTop: "Buying a",
        titleBottom: "Home",
        description: "Secure your future. [Know if you can afford a mortgage](/blog/know-if-you-can-afford-mortgage/) before you apply.",
        href: "/journey/buying-a-home/",
        color: "#c6e07f"
    },
    {
        number: 4,
        titleTop: "Investing",
        description: "Grow your wealth. [Start investing long term](/blog/owning-a-piece-of-the-future/) once your home and savings are secure.",
        href: "/journey/investing/",
        color: "#a7e0a5"
    }
];

export function JourneyNavigation({ currentStep }: JourneyNavigationProps) {
    return (
        <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-center mb-8">Navigate the Journey</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {journeySteps.map((step) => (
                    <div 
                        key={step.number} 
                        className={`flex flex-col items-center w-full sm:w-48 transition-opacity ${currentStep === step.number ? 'opacity-40 pointer-events-none' : 'hover:opacity-100'}`}
                    >
                        <CircleNum number={step.number} />
                        <PostIt 
                            color={step.color} 
                            titleTop={step.titleTop} 
                            titleBottom={step.titleBottom} 
                            href={currentStep === step.number ? undefined : step.href} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
