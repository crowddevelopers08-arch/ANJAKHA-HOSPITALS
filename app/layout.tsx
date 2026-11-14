import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const GTM_ID = "GTM-K3N59X8L";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const description =
  "Get expert consultation and treatment options for circumcision, laparoscopy, piles, hernia and gallstone conditions at Anjakha Hospitals.";

export const metadata: Metadata = {
  metadataBase: new URL("https://anjakhahospitals.com"),
  title: "Circumcision, Laparoscopy, Piles, Hernia & Gallstone Treatment | Anjakha Hospitals",
  description,
  openGraph: {
    title: "Looking for the Right Treatment for Your Health Concern? | Anjakha Hospitals",
    description,
    images: ["/images/logo.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b0505",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        {/* Google tag */}
        <script async src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());`,
          }}
        />
      </head>
      <body className="bg-white font-sans text-plum-950" suppressHydrationWarning>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
        {children}
      </body>
    </html>
  );
}


// hi