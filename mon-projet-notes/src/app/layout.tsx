// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assurez-vous que Tailwind est importé ici
import Navbar from "@/components/Navbar"; // Importez votre Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestion des Notes des Élèves", // Titre par défaut pour l'onglet du navigateur
  description: "Application pour gérer les notes des élèves",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50`}> 
        <Navbar /> 
        <main className="container mx-auto p-4 mt-4"> 
          {children}
        </main>
         <footer className="bg-gray-200 text-center p-4 mt-10 mx-auto">
           2024 Mon Application de gestion des elèves. Tous droits réservés.
        </footer> 
      </body>
    </html>
  );
}