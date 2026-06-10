import "./globals.css";
import {Suspense} from "react";
import {CartProvider} from "@/components/cart-provider";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {AttributionTracker} from "@/components/attribution-tracker";
import Script from "next/script";

export const metadata = {
    title: "Eco-Hardware",
    description: "Boutique e-commerce demo orientee tunnel d'achat, telemetrie et analytique."
};

export default function RootLayout({children}) {
    return (
        <html lang="fr">
        <body>

        <CartProvider>
            <Suspense fallback={null}>
                <AttributionTracker/>
            </Suspense>
            <div className="site-shell">
                <SiteHeader/>
                <main className="site-main">{children}</main>
                <SiteFooter/>
            </div>
        </CartProvider>
        {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
            <Script
                src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
                data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                strategy="afterInteractive"
            />
        ) : null}
        </body>
        </html>
    );
}
