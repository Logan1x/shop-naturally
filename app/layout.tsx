import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shop Naturally",
  description: "Find the best phone for you",
  openGraph: {
    title: "Shop Naturally",
    description: "Find the best phone for you",
    type: "website",
    url: "https://shop.khushal.live",
    images: [
      {
        url: "/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "Shop Naturally Open Graph Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={`${dmSans.className} antialiased`}>{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-X1FFBRMC46`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X1FFBRMC46');
        `}
      </Script>
    </html>
  );
}
