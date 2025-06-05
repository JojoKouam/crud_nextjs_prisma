// src/app/page.tsx
"use client"; 

import { useState, useEffect, FormEvent } from 'react';
import { Eleve } from '@/types'; 

// Définition du type pour les données du formulaire
interface EleveFormData {
  nom: string;
  sexe: "Masculin" | "Féminin";
  note: string; 
}

export default function HomePage() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EleveFormData>({
    nom: '',
    sexe: 'Masculin', // Valeur par défaut
    note: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Pour gérer l'édition
  const [editingEleve, setEditingEleve] = useState<Eleve | null>(null);

  // Fonction pour récupérer les élèves
  const fetchEleves = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/eleves');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEleves(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les élèves au montage du composant
  useEffect(() => {
    fetchEleves();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const noteNum = parseInt(formData.note);
    if (isNaN(noteNum) || noteNum < 0 || noteNum > 20) {
      setFormError("La note doit être un nombre entre 0 et 20.");
      return;
    }
    if (!formData.nom.trim()) {
        setFormError("Le nom ne peut pas être vide.");
        return;
    }

    const payload = {
      nom: formData.nom,
      sexe: formData.sexe,
      note: noteNum,
    };

    try {
      const url = editingEleve ? `/api/eleves/${editingEleve.id}` : '/api/eleves';
      const method = editingEleve ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur lors de ${editingEleve ? "la modification" : "l'ajout"}`);
      }

      // Réinitialiser le formulaire et recharger les données
      setFormData({ nom: '', sexe: 'Masculin', note: '' });
      setEditingEleve(null); // Quitter le mode édition
      await fetchEleves(); // Recharger la liste
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Une erreur inconnue est survenue.");
      }
    }
  };

  const handleEdit = (eleve: Eleve) => {
    setEditingEleve(eleve);
    setFormData({
      nom: eleve.nom,
      sexe: eleve.sexe,
      note: eleve.note.toString(),
    });
    window.scrollTo(0, 0); // Remonter en haut de la page pour voir le formulaire
  };

  const handleCancelEdit = () => {
    setEditingEleve(null);
    setFormData({ nom: '', sexe: 'Masculin', note: '' });
    setFormError(null);
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élève ?")) {
      try {
        const response = await fetch(`/api/eleves/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de la suppression");
        }
        await fetchEleves(); // Recharger la liste
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // Afficher l'erreur au niveau de la page
        } else {
          setError("Une erreur inconnue est survenue."); // Gestion d'une erreur non-Error
        }
      }
    }
  };
  // Styles pour les éléments du formulaire

  const inputStyle = "border p-2 rounded w-full mb-2";
  const buttonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  const buttonRedStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2";
  const buttonGrayStyle = "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2";

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center">{editingEleve ? "Modifier l'élève" : "Ajouter un Nouvel Élève"}</h1>

      {formError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">{formError}</p>}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">Nom de l&#39;élève:</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              className={inputStyle}
              required
            />
          </div>
          <div>
            <label htmlFor="sexe" className="block text-sm font-medium text-gray-700 mb-1">Sexe:</label>
            <select
              id="sexe"
              name="sexe"
              value={formData.sexe}
              onChange={handleInputChange}
              className={inputStyle}
            >
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note (0-20):</label>
            <input
              type="number"
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className={inputStyle}
              min="0"
              max="20"
              required
            />
          </div>
        </div>
        <div className="text-right">
          {editingEleve && (
            <button type="button" onClick={handleCancelEdit} className={buttonGrayStyle}>
              Annuler Édition
            </button>
          )}
          <button type="submit" className={`${buttonStyle} ml-2`}>
            {editingEleve ? "Mettre à jour" : "Ajouter l'élève"}
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-semibold mb-4 text-center">Liste des Élèves</h2>
      {isLoading && <p className="text-center">Chargement des élèves...</p>}
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4 text-center">Erreur: {error}</p>}
      {!isLoading && !error && eleves.length === 0 && <p className="text-center text-gray-500">Aucun élève enregistré pour le moment.</p>}

      {!isLoading && !error && eleves.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nom</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Sexe</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Note</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {eleves.map((eleve) => (
                <tr key={eleve.id} className="border-b hover:bg-gray-100">
                  <td className="text-left py-3 px-4">{eleve.id}</td>
                  <td className="text-left py-3 px-4">{eleve.nom}</td>
                  <td className="text-left py-3 px-4">{eleve.sexe}</td>
                  <td className="text-left py-3 px-4">{eleve.note}</td>
                  <td className="text-left py-3 px-4">
                    <button onClick={() => handleEdit(eleve)} className={`${buttonStyle} text-xs mr-2`}>
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(eleve.id)} className={`${buttonRedStyle} text-xs`}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}