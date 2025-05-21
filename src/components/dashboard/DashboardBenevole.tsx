import React from "react";

const DashboardBenevole = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Espace bénévole</h1>
    <p>Bienvenue sur votre espace personnel !</p>
    <ul className="mt-6 list-disc list-inside text-gray-700">
      <li>Consultez vos missions en cours et passées</li>
      <li>Gérez vos informations personnelles</li>
      <li>Visualisez vos badges et votre engagement</li>
    </ul>
    {/* TODO: Ajouter la liste des missions du bénévole */}
  </div>
);

export default DashboardBenevole; 