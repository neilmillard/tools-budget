'use client';

import React, {useState} from 'react';
import {BabylonLesson, babylonLessons} from "@/data/babylonData";
import Story from "@/app/components/Story";
import Link from "next/link";

function RichestManInBabylon() {
    const [activeLesson, setActiveLesson] = useState<number>(0);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8">The Richest Man in Babylon</h1>
            <h2 className="text-2xl font-bold text-center mb-8">Seven Cures for a lean purse</h2>

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
