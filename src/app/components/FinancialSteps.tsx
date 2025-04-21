import React from 'react';
import {PostIt} from "@/app/components/ui/PostIt";
import {CircleNum} from "@/app/components/ui/CircleNum";

const FinancialSteps = () => {
    return (
        <div className="w-full px-4 py-8">
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col items-center w-full sm:w-64">
                    <CircleNum number={1}/>
                    <PostIt color="#ffaa66" titleTop="Paying Debt"/>
                    <p className="pt-6">You might be spending more than your income. You have credit card debts and are paying them off.</p>
                </div>
                <div className="flex flex-col items-center w-full sm:w-64">
                    <CircleNum number={2}/>
                    <PostIt color="#f7dc6f" titleTop="Saving"/>
                    <p className="pt-6">Your expenses are lower than your income, so you are saving money every month. Perhaps towards a Home Deposit.</p>
                </div>
                <div className="flex flex-col items-center w-full sm:w-64">
                    <CircleNum number={3}/>
                    <PostIt color="#c6e07f" titleTop="Buying a" titleBottom="Home"/>
                    <p className="pt-6">You have a Mortgage and are paying it off. You might have savings too.</p>
                </div>
                <div className="flex flex-col items-center w-full sm:w-64">
                    <CircleNum number={4}/>
                    <PostIt color="#a7e0a5" titleTop="Investing"/>
                    <p className="pt-6">Your money is under control, you have a home, and sufficient savings to think about investing long term.</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialSteps;
