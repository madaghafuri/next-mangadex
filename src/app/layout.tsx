import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SearchTitle } from "@/components/home-search";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "p-0 m-0")}>
        <main>
          <div
            className={cn(
              "grid grid-cols-[10%,auto,10%,10%] items-center gap-3",
              "px-5 py-3",
              "bg-zinc-800"
            )}
          >
            <h1>Hello</h1>
            <Link href={"/"}>
              <h1 className="cursor-pointer">Logo</h1>
            </Link>
            <SearchTitle />
            <h1>Hello</h1>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
