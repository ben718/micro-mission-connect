import React from 'react';

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Voisin Solidaire
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          L'Uber du bénévolat - Trouvez votre mission en 2 clics
        </p>
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <p>Test - Si vous voyez ce message, l'application fonctionne !</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

