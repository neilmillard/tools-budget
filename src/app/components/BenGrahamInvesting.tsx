'use client';

import React, {useState} from 'react';
import {BGLesson, bgLessons} from "@/data/benGrahamInvestingData";
import Story from "@/app/components/Story";


function BenGrahamInvesting() {
    const [activeLesson, setActiveLesson] = useState<number>(0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-500">
            <h1 className="text-3xl font-bold text-center mb-2">Ben Graham Investing Principles</h1>
            <h2 className="text-xl font-semibold text-center mb-8 text-yellow-500">Inspired by &quot;The Intelligent Investor&quot;</h2>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {bgLessons.map((lesson: BGLesson, index: number) => (
                    <button
                        key={index}
                        onClick={() => setActiveLesson(index)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
              ${activeLesson === index
                            ? 'bg-red-700 text-yellow-300'
                            : 'bg-white text-red-700 hover:bg-red-50 border border-red-500'}`}
                    >
                        {lesson.button}
                    </button>
                ))}
            </div>
            <div className="intelligent-investor-theme">
                <Story lessonData={bgLessons[activeLesson]}/>
            </div>
            <div className="justify-center flex pt-6 font-bold">
                <a href="https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:text-yellow-500 transition-colors">Find the Book</a>
            </div>
        </div>
    );
}

export default BenGrahamInvesting;
