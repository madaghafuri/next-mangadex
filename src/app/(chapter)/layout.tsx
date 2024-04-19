import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chapter",
  description: "Generated from Chapter",
};

export default function ChapterViewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "p-0 m-0")}>
        <main>{children}</main>
      </body>
    </html>
  );
}
