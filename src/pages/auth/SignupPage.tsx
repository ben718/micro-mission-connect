import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { languageService } from '../../lib/supabase';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, signupAssociation, isLoading, error } = useAuthStore();
  
  // État pour le type d'utilisateur
  const [userType, setUserType] = useState<'benevole' | 'association'>('benevole');
  
  // État pour le formulaire multi-étapes
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(2); // Par défaut pour bénévole
  
  // États communs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // États pour bénévole
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  // États pour association
  const [associationName, setAssociationName] = useState('');
  const [siret, setSiret] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // État pour les erreurs de validation
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Mise à jour du nombre d'étapes en fonction du type d'utilisateur
  useEffect(() => {
    setMaxStep(userType === 'benevole' ? 2 : 3);
    setStep(1); // Réinitialiser à l'étape 1 lors du changement de type
  }, [userType]);
  
  // Liste des langues disponibles
  const availableLanguages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'Anglais' },
    { code: 'es', name: 'Espagnol' },
    { code: 'de', name: 'Allemand' },
    { code: 'it', name: 'Italien' },
    { code: 'ar', name: 'Arabe' },
    { code: 'zh', name: 'Chinois' },
    { code: 'ru', name: 'Russe' },
    { code: 'pt', name: 'Portugais' },
    { code: 'ja', name: 'Japonais' }
  ];
  
  // Liste des catégories d'associations
  const associationCategories = [
    'Aide sociale',
    'Environnement',
    'Éducation',
    'Santé',
    'Culture',
    'Sport',
    'Humanitaire',
    'Droits humains',
    'Animaux',
    'Autre'
  ];
  
  // Fonction pour ajouter une langue
  const addLanguage = () => {
    if (selectedLanguage && !languages.includes(selectedLanguage)) {
      setLanguages([...languages, selectedLanguage]);
      setSelectedLanguage('');
    }
  };
  
  // Fonction pour supprimer une langue
  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };
  
  // Validation de l'étape 1
  const validateStep1 = () => {
    if (!email) {
      setValidationError('L\'email est requis');
      return false;
    }
    
    if (!password) {
      setValidationError('Le mot de passe est requis');
      return false;
    }
    
    if (password.length < 8) {
      setValidationError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  // Validation de l'étape 2 pour bénévole
  const validateStep2Benevole = () => {
    if (!firstName) {
      setValidationError('Le prénom est requis');
      return false;
    }
    
    if (!lastName) {
      setValidationError('Le nom est requis');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  // Validation de l'étape 2 pour association
  const validateStep2Association = () => {
    if (!associationName) {
      setValidationError('Le nom de l\'association est requis');
      return false;
    }
    
    if (!description) {
      setValidationError('La description est requise');
      return false;
    }
    
    if (!category) {
      setValidationError('La catégorie est requise');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  // Validation de l'étape 3 pour association
  const validateStep3Association = () => {
    if (!address) {
      setValidationError('L\'adresse est requise');
      return false;
    }
    
    if (!city) {
      setValidationError('La ville est requise');
      return false;
    }
    
    if (!postalCode) {
      setValidationError('Le code postal est requis');
      return false;
    }
    
    if (!phone) {
      setValidationError('Le téléphone est requis');
      return false;
    }
    
    if (!contactName) {
      setValidationError('Le nom du contact est requis');
      return false;
    }
    
    if (!contactRole) {
      setValidationError('Le rôle du contact est requis');
      return false;
    }
    
    setValidationError(null);
    return true;
  };
  
  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = validateStep1();
    } else if (step === 2) {
      if (userType === 'benevole') {
        isValid = validateStep2Benevole();
      } else {
        isValid = validateStep2Association();
      }
    }
    
    if (isValid) {
      if (step < maxStep) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };
  
  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async () => {
    if (userType === 'benevole') {
      if (validateStep2Benevole()) {
        const result = await signup(email, password, firstName, lastName, languages);
        
        if (result.success) {
          // Ajouter les langues au profil si nécessaire
          if (languages.length > 0) {
            try {
              for (const lang of languages) {
                await languageService.addLanguage(lang, 'intermédiaire', languages.indexOf(lang) === 0);
              }
            } catch (error) {
              console.error('Erreur lors de l\'ajout des langues:', error);
            }
          }
          
          navigate('/dashboard');
        }
      }
    } else {
      if (validateStep3Association()) {
        const result = await signupAssociation(
          email,
          password,
          associationName,
          siret,
          description,
          address,
          city,
          postalCode,
          phone,
          category,
          contactName,
          contactRole,
          contactEmail || undefined
        );
        
        if (result.success) {
          navigate('/dashboard');
        }
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center text-primary-600 mb-6">
          Rejoindre Voisin Solidaire
        </h1>
        
        {/* Sélection du type d'utilisateur */}
        {step === 1 && (
          <div className="mb-6">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${userType === 'benevole' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUserType('benevole')}
              >
                Bénévole
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${userType === 'association' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setUserType('association')}
              >
                Association
              </button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {userType === 'benevole' 
                ? 'Je souhaite aider en tant que bénévole'
                : 'Je représente une association et souhaite publier des missions'}
            </p>
          </div>
        )}
        
        {/* Indicateur d'étape */}
        <div className="flex justify-between mb-8">
          {Array.from({ length: maxStep }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 
                    ? 'bg-green-500 text-white' 
                    : step === index + 1 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1">
                {index === 0 
                  ? 'Compte' 
                  : userType === 'benevole' 
                    ? 'Profil' 
                    : index === 1 
                      ? 'Association' 
                      : 'Contact'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Affichage des erreurs */}
        {(error || validationError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || validationError}
          </div>
        )}
        
        {/* Étape 1: Informations de compte */}
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Au moins 8 caractères
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        
        {/* Étape 2: Profil bénévole */}
        {step === 2 && userType === 'benevole' && (
          <div>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langues parlées
              </label>
              <div className="flex mb-2">
                <select
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Sélectionner une langue</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code} disabled={languages.includes(lang.code)}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={addLanguage}
                  disabled={!selectedLanguage}
                >
                  Ajouter
                </button>
              </div>
              
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang) => {
                    const langName = availableLanguages.find(l => l.code === lang)?.name || lang;
                    return (
                      <div key={lang} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {langName}
                        <button
                          type="button"
                          className="ml-2 text-primary-600 hover:text-primary-800 focus:outline-none"
                          onClick={() => removeLanguage(lang)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Facultatif - Ajoutez les langues que vous parlez pour trouver des missions adaptées
              </p>
            </div>
          </div>
        )}
        
        {/* Étape 2: Informations association */}
        {step === 2 && userType === 'association' && (
          <div>
            <div className="mb-4">
              <label htmlFor="associationName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'association
              </label>
              <input
                type="text"
                id="associationName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={associationName}
                onChange={(e) => setAssociationName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro SIRET
              </label>
              <input
                type="text"
                id="siret"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Facultatif - Sera utilisé pour la vérification
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {associationCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        {/* Étape 3: Contact association */}
        {step === 3 && userType === 'association' && (
          <div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du contact principal
              </label>
              <input
                type="text"
                id="contactName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700 mb-1">
                Fonction du contact
              </label>
              <input
                type="text"
                id="contactRole"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email du contact (si différent)
              </label>
              <input
                type="email"
                id="contactEmail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Facultatif - Laissez vide si identique à l'email principal
              </p>
            </div>
          </div>
        )}
        
        {/* Boutons de navigation */}
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isLoading}
            >
              Précédent
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-700 bg-transparent hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Déjà inscrit ?
            </button>
          )}
          
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : step === maxStep ? 'S\'inscrire' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
