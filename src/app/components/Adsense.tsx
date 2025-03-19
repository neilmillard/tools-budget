import Script from "next/script";

export default function Adsense() {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
        return (
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process
                    .env.NEXT_PUBLIC_ADSENSE_PUB_ID!}`}
                crossOrigin="anonymous"
                strategy="afterInteractive"
            ></Script>
        )
    }
}
