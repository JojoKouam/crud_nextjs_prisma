// src/types/index.ts
export interface Eleve {
  id: number;
  nom: string;
  sexe: "Masculin" | "Féminin";
  note: number;
  createdAt?: string; // Optionnel car on ne l'affiche pas toujours
  updatedAt?: string; // Optionnel
}