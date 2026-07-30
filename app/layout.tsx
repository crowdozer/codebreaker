import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import "@/app/styles/globals.css";

export const metadata: Metadata = {
  title: "Codebreaker",
  description: "coolest corner of the internet 😎",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
