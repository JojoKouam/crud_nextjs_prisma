// src/components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          Gestion des Notes
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="px-3 hover:text-gray-300">
            Accueil
          </Link>
          <Link href="/eleves" className="px-3 hover:text-gray-300">
            Élèves
          </Link>
          <Link href="/ajouter-eleve" className="px-3 hover:text-gray-300">
            Ajouter Élève
          </Link>
          <Link href="/contact" className="px-3 hover:text-gray-300">
            Contact
          </Link>       
      </div>
        </div>
    </nav>
    );
}

export default Navbar;