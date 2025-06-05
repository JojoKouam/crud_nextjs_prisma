// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Déclarez la variable globale pour TypeScript si ce n'est pas déjà fait dans global.d.ts
// declare global {
//   var prisma: PrismaClient | undefined;
// }

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-expect-error: 'prisma' is not defined on type 'NodeJS.Global' by default
  if (!global.prisma) { // Utilisez globalThis pour être plus moderne si vous préférez
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Assigning PrismaClient instance to global object for development
    global.prisma = new PrismaClient(); // C'est ici que l'erreur se produit
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;