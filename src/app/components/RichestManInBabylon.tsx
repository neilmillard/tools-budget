'use client';

import React, {useState} from 'react';
import {BabylonLesson, babylonLessons} from "@/data/babylonData";
import Story from "@/app/components/Story";
import Link from "next/link";

function RichestManInBabylon() {
    const [activeLesson, setActiveLesson] = useState<number>(0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-amber-900 mb-4">The Richest Man in Babylon</h1>
                <p className="text-xl text-amber-800 italic mb-6">Timeless money wisdom, written 4,000 years ago — still true today</p>
                <div className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
                    <p className="mb-4">
                        George S. Clason&#39;s classic book, first published in 1926, uses ancient Babylonian parables to teach the 
                        fundamental principles of personal finance. These &quot;Seven Cures for a Lean Purse&quot; form a complete 
                        financial philosophy that maps perfectly onto our modern money journey.
                    </p>
                    <p>
                        Explore the lessons below and see how ancient wisdom can be applied through our modern tools.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {babylonLessons.map((lesson: BabylonLesson, index: number) => (
                    <button
                        key={index}
                        onClick={() => setActiveLesson(index)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors 
              ${activeLesson === index
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                    >
                        {lesson.button}
                    </button>
                ))}
            </div>
            <Story lessonData={babylonLessons[activeLesson]}/>
            <div className="justify-center flex pt-6 font-bold">
                <Link href="https://upload.wikimedia.org/wikipedia/commons/e/e7/The_Richest_Man_In_Babylon.pdf">Download the PDF</Link>
            </div>
        </div>
    );
}

export default RichestManInBabylon;
