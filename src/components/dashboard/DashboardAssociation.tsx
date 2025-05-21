import React from "react";

const DashboardAssociation = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Espace association</h1>
    <p>Bienvenue sur votre espace association !</p>
    <ul className="mt-6 list-disc list-inside text-gray-700">
      <li>Créez et gérez vos missions</li>
      <li>Suivez les inscriptions des bénévoles</li>
      <li>Accédez à vos statistiques</li>
    </ul>
    {/* TODO: Ajouter la gestion des missions créées par l'association */}
  </div>
);

export default DashboardAssociation; 