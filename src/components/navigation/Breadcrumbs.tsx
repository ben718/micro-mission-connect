import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Configuration des labels pour les routes
  const routeLabels: Record<string, string> = {
    dashboard: 'Tableau de bord',
    missions: 'Missions',
    about: 'À propos',
    contact: 'Contact',
    profile: 'Profil',
    notifications: 'Notifications',
    associations: 'Associations',
    auth: 'Authentification',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    create: 'Créer',
    edit: 'Modifier',
    list: 'Liste',
    volunteer: 'Bénévole',
    organization: 'Association'
  };

  // Ne pas afficher les breadcrumbs sur la page d'accueil
  if (location.pathname === '/') {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Accueil', path: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((pathname) => {
    currentPath += `/${pathname}`;
    const label = routeLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
    breadcrumbs.push({ label, path: currentPath });
  });

  return (
    <nav aria-label="Fil d'Ariane" className="bg-gray-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              {index === 0 && (
                <Home className="w-4 h-4 text-gray-500 mr-1" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;

