import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PostIt(props: {
    titleTop?: string;
    titleBottom?: string;
    color: string;
    href?: string;
}) {
    /* Colored box with title */
    const content = (
        <div
            className="group relative flex items-center justify-center w-full p-6 text-black shadow-md h-24 transition-colors"
            style={{backgroundColor: props.color}}
        >
            <h3 className="text-2xl font-semibold text-center whitespace-pre-line">
                {props.titleTop}
                {props.titleTop && props.titleBottom && <br />}
                {props.titleBottom}
            </h3>
            {props.href && (
                <div className="absolute bottom-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={20} />
                </div>
            )}
        </div>
    );

    if (props.href) {
        return (
            <Link href={props.href} className="w-full transition-transform hover:scale-105 cursor-pointer">
                {content}
            </Link>
        );
    }

    return content;
}
