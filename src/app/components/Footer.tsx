import Link from "next/link";

export function Footer() {
    return <div className="pt-4 flex h-full flex-row justify-center">
        Made with Love by <Link href="https://neilmillard.com" className="pl-1">Neil Millard</Link>
    </div>
}