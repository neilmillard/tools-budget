import Link from "next/link";

export function Footer() {
    return <div className="pt-4 flex h-full flex-col justify-center">
        <div className="flex flex-row justify-center">
            Assembled by <Link href="https://neilmillard.com" className="pl-1">Neil Millard</Link>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
            Calculators provided are a guide, your financial provider may use a different calculation
        </div>
    </div>
}