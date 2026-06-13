import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "EchoDNA — Your Music. Your DNA.",
  description:
    "Discover your listening archetype, genre DNA, mood spectrum, and music alter ego. Connect Spotify and get your personalized music personality analysis in seconds.",
  keywords: [
    "music personality",
    "spotify wrapped",
    "listening archetype",
    "genre DNA",
    "music alter ego",
    "mood spectrum",
    "spotify analysis",
    "echodna",
  ],
  authors: [{ name: "EchoDNA" }],
  openGraph: {
    title: "EchoDNA — Your Music. Your DNA.",
    description:
      "Your music taste says more about you than you think. Discover your archetype, genre DNA, alter ego & more.",
    type: "website",
    siteName: "EchoDNA",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoDNA — Your Music. Your DNA.",
    description:
      "Your music taste says more about you than you think. Discover your archetype, genre DNA, alter ego & more.",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${inter.className} antialiased min-h-screen bg-background text-foreground transition-colors duration-700`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow flex flex-col min-h-screen">{children}</div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
