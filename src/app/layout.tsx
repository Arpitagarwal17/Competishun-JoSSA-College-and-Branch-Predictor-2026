import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JoSAA College & Branch Predictor 2026",
  description: "Find colleges and branches based on JoSAA opening and closing ranks."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
