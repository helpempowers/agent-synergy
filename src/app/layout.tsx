import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Synergy - AI Agents That Work Like Employees",
  description: "Plug-and-play AI agents that work like employees—reliable, scalable, and tailored for mid-market efficiency.",
  keywords: [
    "AI agents",
    "automation",
    "mid-market",
    "business efficiency",
    "AI automation",
    "workforce augmentation",
    "customer support",
    "QA testing",
    "reporting",
    "business intelligence"
  ],
  authors: [{ name: "Agent Synergy Team" }],
  creator: "Agent Synergy",
  publisher: "Agent Synergy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Agent Synergy - AI Agents That Work Like Employees",
    description: "Plug-and-play AI agents that work like employees—reliable, scalable, and tailored for mid-market efficiency.",
    url: "/",
    siteName: "Agent Synergy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agent Synergy - AI Agents That Work Like Employees",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Synergy - AI Agents That Work Like Employees",
    description: "Plug-and-play AI agents that work like employees—reliable, scalable, and tailored for mid-market efficiency.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
