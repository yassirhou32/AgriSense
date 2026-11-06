import type { Metadata } from "next";
import { Syne, Instrument_Serif } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AirGo — Casque urbain intelligent",
  description:
    "Étude de cas marketing innovation : casque connecté mobilité douce. Sécurité, design, mix 4P, plan 6 mois.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${syne.variable} ${instrument.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
