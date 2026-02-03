import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import Script from "next/script";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gabbar Singh Tax",
  description:
    "A tax platform to calculate all kinds of taxes, compare globally, and track India's tax health and fiscal data.",
  metadataBase: new URL("https://gabbersingh.tax"),
  keywords: [
    "tax calculator",
    "India tax",
    "income tax",
    "GST",
    "global tax comparison",
    "tax health",
    "fiscal deficit",
    "public finance",
  ],
  openGraph: {
    title: "Gabbar Singh Tax",
    description:
      "Calculate taxes, compare globally, and explore India's tax health and fiscal data.",
    url: "https://gabbersingh.tax",
    siteName: "Gabbar Singh Tax",
    images: [
      {
        url: "https://gabbersingh.tax/og-placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Gabbar Singh Tax preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabbar Singh Tax",
    description:
      "Calculate taxes, compare globally, and explore India's tax health and fiscal data.",
    images: ["https://gabbersingh.tax/og-placeholder.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${fraunces.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-[#f7f2ea] text-[#1f1d1a]">
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-PKF5LT2T99"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PKF5LT2T99');`}
          </Script>
          <div className="mx-auto flex w-full max-w-6xl items-center justify-end px-6 pt-6 md:px-10">
            <SiteNav />
          </div>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Gabbar Singh Tax",
                url: "https://gabbersingh.tax",
                description:
                  "A tax platform to calculate all kinds of taxes, compare globally, and track India's tax health and fiscal data.",
                publisher: {
                  "@type": "Person",
                  name: "Amit",
                  sameAs: [
                    "https://github.com/aforamitdev",
                    "https://www.linkedin.com/in/aforamit/",
                  ],
                },
              }),
            }}
          />
          <footer className="mt-10 border-t border-[#e5dbcf] bg-gradient-to-r from-[#fff6ea] via-[#ffffff] to-[#e7fbf5]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[#6b6156] md:flex-row md:items-center md:justify-between md:px-10">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-[#a68b76]">
                  Built for clarity
                </span>
                <span className="text-base font-semibold text-[#1f1d1a]">
                  Gabbar Singh Tax
                </span>
                <span className="text-xs text-[#7a6f63]">
                  Turning tax chaos into clean, calm math.
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/aforamitdev"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/aforamit/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
                >
                  LinkedIn
                </a>
                <span className="rounded-full bg-[#1f1d1a] px-3 py-2 text-[11px] uppercase tracking-[0.25em] text-white">
                  © {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
