import React from 'react';
import {PostIt} from "@/app/components/ui/PostIt";
import {CircleNum} from "@/app/components/ui/CircleNum";
import {journeySteps} from "@/app/journey/_components/JourneyNavigation";

const FinancialSteps = () => {
    return (
        <div className="w-full px-4 py-8">
            <div className="flex flex-wrap justify-between gap-4">
                {journeySteps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center w-full sm:w-64">
                        <CircleNum number={step.number}/>
                        <PostIt 
                            color={step.color} 
                            titleTop={step.titleTop} 
                            titleBottom={step.titleBottom} 
                            href={step.href}
                        />
                        <p className="pt-6">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinancialSteps;
