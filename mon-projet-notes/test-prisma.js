/* eslint-disable @typescript-eslint/no-require-imports */
// test-prisma.js
const { PrismaClient } = require('@prisma/client'); // <--- CHANGEMENT ICI

async function main() {
  console.log("Attempting to instantiate PrismaClient...");
  try {
    const prisma = new PrismaClient();
    console.log("PrismaClient instantiated successfully.");
    // Optionnel : faire une petite requête simple
    // console.log("Querying database...");
    // const eleves = await prisma.eleve.findMany(); // Exemple de requête
    // console.log(`Found ${eleves.length} eleves.`);
    // const count = await prisma.eleve.count();
    // console.log(`Number of eleves: ${count}`);
    await prisma.$disconnect();
    console.log("Disconnected.");
  } catch (e) {
    console.error("Error during Prisma test:", e);
  }
}

main();