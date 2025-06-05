// src/global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Il est important de ne rien exporter de ce fichier (pas de `export {}`)
// pour qu'il soit traité comme une déclaration d'ambiance globale.