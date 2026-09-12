import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { defaultSettings } from "@/lib/site";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

/**
 * Base metadata only. The public site overrides this from `site_settings` in
 * `app/(site)/layout.tsx`; the admin sets its own.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${defaultSettings.full_name} — ${defaultSettings.role}`,
    template: `%s — ${defaultSettings.full_name}`,
  },
  description: defaultSettings.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
