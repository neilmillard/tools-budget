import {BabylonLesson} from "@/data/babylonData";
import React from "react";
import ToolCTA from "@/app/components/blog/ToolCTA";

export default function Story(props: { lessonData: BabylonLesson }) {
    return <>
        <div className="border-t border-b py-6 mb-6">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-semibold">{props.lessonData.title}</h2>
                {props.lessonData.stage && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {props.lessonData.stage}
                    </span>
                )}
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-4">{props.lessonData.summary}</h3>
            <blockquote className="pl-4 border-l-4 border-amber-400 italic text-gray-800 mb-4">
                &#34;{props.lessonData.citation}&#34;
            </blockquote>
        </div>

        <div>
            <h3 className="text-lg font-medium mb-2">The Story Behind This Lesson:</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="italic text-gray-700 leading-relaxed">{props.lessonData.story}</p>
            </div>
        </div>

        {props.lessonData.toolUrl && props.lessonData.toolName && (
            <div className="mt-8">
                <ToolCTA 
                    title="Take Action on This Lesson"
                    toolName={props.lessonData.toolName}
                    toolUrl={props.lessonData.toolUrl}
                    description={`Put this ancient wisdom into practice today using our ${props.lessonData.toolName}.`}
                />
            </div>
        )}
    </>;
}
