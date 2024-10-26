import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";


export const metadata: Metadata = {
  title: "Convocord",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning={true}>
       <ClerkProvider dynamic>
       <ConvexClientProvider>
   
       {children}
   
       </ConvexClientProvider>
       </ClerkProvider>
      </body>
    </html>
  );
}
