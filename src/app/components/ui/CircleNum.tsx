import React from "react";

export function CircleNum(props: {
    number: number;
}) {
    /* Circle with number */
    return <div
        className="flex items-center justify-center w-16 h-16 mb-6 border-4 border-black rounded-full">
        <span className="text-3xl font-bold">{props.number}</span>
    </div>;
}
