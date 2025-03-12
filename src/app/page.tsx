import Link from "next/link";

export default function Home() {
    return (
        <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4">Money Tools</h2>
            <button className={"p-2 rounded bg-blue-500 text-white"} >
                <Link href="/budget">Budget Planner</Link>
            </button>
        </div>
    )
}
