// src/app/api/eleves/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ajustez le chemin
import { updateEleveSchema } from '@/lib/schemas'; // Ajustez le chemin
import { Prisma } from '@prisma/client';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/eleves/:id - Récupérer un élève par son ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
    }

    const eleve = await prisma.eleve.findUnique({
      where: { id },
    });

    if (!eleve) {
      return NextResponse.json({ message: 'Élève non trouvé' }, { status: 404 });
    }
    return NextResponse.json(eleve);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'élève ${params.id}:`, error);
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 });
  }
}

// PUT /api/eleves/:id - Modifier un élève
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateEleveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const dataToUpdate = validation.data;

    const eleveModifie = await prisma.eleve.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(eleveModifie);
  } catch (error) {
    console.error(`Erreur lors de la modification de l'élève ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Enregistrement à mettre à jour non trouvé
        return NextResponse.json({ message: 'Élève non trouvé pour la mise à jour' }, { status: 404 });
      }
    }
    if (error instanceof SyntaxError) { // Erreur de parsing JSON
        return NextResponse.json({ message: 'Requête JSON invalide' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 });
  }
}

// DELETE /api/eleves/:id - Supprimer un élève
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 });
    }

    await prisma.eleve.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Élève supprimé avec succès' }, { status: 200 });
    // Ou un status 204 No Content sans corps de réponse
    // return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'élève ${params.id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Enregistrement à supprimer non trouvé
        return NextResponse.json({ message: 'Élève non trouvé pour la suppression' }, { status: 404 });
      }
    }
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 });
  }
}