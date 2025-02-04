import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from "@/components/MyNavbar";
import React from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        <MyNavbar />
        {children}
      </body>
    </html>
  );
}
