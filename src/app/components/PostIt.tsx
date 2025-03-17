import React from "react";

export function PostIt(props: {
    titleTop?: string;
    titleBottom?: string;
    color: string
}) {
    /* Colored box with title */
    return <div
        className="flex items-center justify-center w-full p-6 text-black shadow-md h-24"
        style={{backgroundColor: props.color}}
    >
        <h3 className="text-2xl font-semibold text-center whitespace-pre-line">
            {props.titleTop}
            {props.titleTop && props.titleBottom && <br />}
            {props.titleBottom}
        </h3>
    </div>;
}
