import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
import { createEleveSchema } from '@/lib/schemas'; 

// POST /api/eleves - Ajouter un nouvel élève
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createEleveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { nom, sexe, note } = validation.data;

    const nouvelEleve = await prisma.eleve.create({
      data: {
        nom,
        sexe,
        note,
      },
    });

    return NextResponse.json(nouvelEleve, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'élève:", error);
    // Gérer les erreurs spécifiques de Prisma ou autres si nécessaire
    if (error instanceof SyntaxError) { // Erreur de parsing JSON
        return NextResponse.json({ message: 'Requête JSON invalide' }, { status: 400 });
    }
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}

// GET /api/eleves - Lister tous les élèves
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') as 'nom' | 'note' | 'sexe' | null;
    const order = searchParams.get('order') as 'asc' | 'desc' | null;
    const filterSexe = searchParams.get('filterSexe');

    let orderByOptions = {};
    if (sortBy && (sortBy === 'nom' || sortBy === 'note' || sortBy === 'sexe')) {
      orderByOptions = { [sortBy]: order === 'desc' ? 'desc' : 'asc' };
    }

    let whereOptions = {};
    if (filterSexe && (filterSexe === "Masculin" || filterSexe === "Féminin")) {
      whereOptions = { sexe: filterSexe };
    }

    const eleves = await prisma.eleve.findMany({
      where: whereOptions,
      orderBy: orderByOptions,
    });
    return NextResponse.json(eleves);
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves:", error);
    return NextResponse.json({ message: "Erreur serveur interne" }, { status: 500 });
  }
}