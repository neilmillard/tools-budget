import {BabylonLesson} from "@/data/babylonData";
import React from "react";

export default function Story(props: { lessonData: BabylonLesson }) {
    return <>
        <div className="border-t border-b py-6 mb-6">
            <h2 className="text-2xl font-semibold mb-2">{props.lessonData.title}</h2>
            <h3 className="text-lg font-medium text-gray-600 mb-4">{props.lessonData.summary}</h3>
            <blockquote className="pl-4 border-l-4 border-amber-400 italic text-gray-800">
                &#34;{props.lessonData.citation}&#34;
            </blockquote>
        </div>

        <div>
            <h3 className="text-lg font-medium mb-2">The Story Behind This Lesson:</h3>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="italic text-gray-700">{props.lessonData.story}</p>
            </div>
        </div>
    </>;
}
