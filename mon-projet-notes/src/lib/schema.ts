// src/lib/schemas.ts
import { z } from 'zod';

export const SexeEnum = z.enum(["Masculin", "Féminin"]);

export const createEleveSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis." }),
  sexe: SexeEnum,
  note: z.number().int().min(0, { message: "La note doit être entre 0 et 20." }).max(20, { message: "La note doit être entre 0 et 20." }),
});

export const updateEleveSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis." }).optional(),
  sexe: SexeEnum.optional(),
  note: z.number().int().min(0).max(20).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni pour la mise à jour",
});