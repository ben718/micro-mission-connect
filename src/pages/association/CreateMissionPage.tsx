import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface MissionFormData {
  title: string;
  description: string;
  category: string;
  duration: number;
  date: string;
  time_start: string;
  time_end: string;
  address: string;
  city: string;
  postal_code: string;
  spots_available: number;
  requirements: string;
  materials_provided: string;
  materials_needed: string;
  min_age: number;
  accessibility_info: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  recurring: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly';
  recurring_interval?: number;
  recurring_end_date?: string;
}

const CreateMissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    description: '',
    category: '',
    duration: 30,
    date: '',
    time_start: '',
    time_end: '',
    address: '',
    city: '',
    postal_code: '',
    spots_available: 1,
    requirements: '',
    materials_provided: '',
    materials_needed: '',
    min_age: 18,
    accessibility_info: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    recurring: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Dans une implémentation réelle, nous enverrions les données à Supabase ici
      console.log('Données de la mission à soumettre:', formData);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des missions
      navigate('/association/missions');
    } catch (error) {
      console.error('Erreur lors de la création de la mission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  return (
    <motion.div 
      className="py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle mission</h1>
        <Link to="/association/missions" className="text-vs-blue-primary">
          Retour aux missions
        </Link>
      </div>
      
      {/* Indicateur d'étapes */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-vs-blue-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-xs mt-1">Informations</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-vs-blue-primary' : 'bg-gray-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-vs-blue-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-xs mt-1">Détails</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-vs-blue-primary' : 'bg-gray-200'}`}></div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-vs-blue-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="text-xs mt-1">Publication</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6">
        {/* Étape 1: Informations de base */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre de la mission *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                placeholder="Ex: Distribution alimentaire aux personnes âgées"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                placeholder="Décrivez la mission, son objectif et son impact..."
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Social">Social</option>
                  <option value="Environnement">Environnement</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Santé">Santé</option>
                  <option value="Culture">Culture</option>
                  <option value="Sport">Sport</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (minutes) *
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="time_start" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de début *
                  </label>
                  <input
                    id="time_start"
                    name="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="time_end" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure de fin *
                  </label>
                  <input
                    id="time_end"
                    name="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                placeholder="Numéro et nom de rue"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="spots_available" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de places disponibles *
              </label>
              <input
                id="spots_available"
                name="spots_available"
                type="number"
                min="1"
                value={formData.spots_available}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {/* Étape 2: Détails supplémentaires */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails supplémentaires</h2>
            
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Prérequis
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                placeholder="Compétences ou qualifications requises..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="materials_provided" className="block text-sm font-medium text-gray-700 mb-1">
                  Matériel fourni
                </label>
                <textarea
                  id="materials_provided"
                  name="materials_provided"
                  value={formData.materials_provided}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  placeholder="Matériel fourni par l'association..."
                />
              </div>
              
              <div>
                <label htmlFor="materials_needed" className="block text-sm font-medium text-gray-700 mb-1">
                  Matériel à apporter
                </label>
                <textarea
                  id="materials_needed"
                  name="materials_needed"
                  value={formData.materials_needed}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  placeholder="Matériel que les bénévoles doivent apporter..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="min_age" className="block text-sm font-medium text-gray-700 mb-1">
                  Âge minimum
                </label>
                <input
                  id="min_age"
                  name="min_age"
                  type="number"
                  min="0"
                  value={formData.min_age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                />
              </div>
              
              <div>
                <label htmlFor="accessibility_info" className="block text-sm font-medium text-gray-700 mb-1">
                  Informations d'accessibilité
                </label>
                <input
                  id="accessibility_info"
                  name="accessibility_info"
                  type="text"
                  value={formData.accessibility_info}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  placeholder="Ex: Accessible en fauteuil roulant"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <input
                  id="recurring"
                  name="recurring"
                  type="checkbox"
                  checked={formData.recurring}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                />
                <label htmlFor="recurring" className="ml-2 block text-sm font-medium text-gray-700">
                  Mission récurrente
                </label>
              </div>
              
              {formData.recurring && (
                <div className="pl-6 mt-2 space-y-4">
                  <div>
                    <label htmlFor="recurring_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                      Fréquence
                    </label>
                    <select
                      id="recurring_frequency"
                      name="recurring_frequency"
                      value={formData.recurring_frequency}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                    >
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="recurring_interval" className="block text-sm font-medium text-gray-700 mb-1">
                        Intervalle
                      </label>
                      <input
                        id="recurring_interval"
                        name="recurring_interval"
                        type="number"
                        min="1"
                        value={formData.recurring_interval}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                        placeholder="Ex: tous les 2 jours/semaines/mois"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="recurring_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <input
                        id="recurring_end_date"
                        name="recurring_end_date"
                        type="date"
                        value={formData.recurring_end_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {/* Étape 3: Contact et publication */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact et publication</h2>
            
            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                Personne à contacter *
              </label>
              <input
                id="contact_name"
                name="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                placeholder="Nom et prénom"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                />
              </div>
              
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  required
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
              <h3 className="text-md font-medium text-blue-800 mb-2">Résumé de la mission</h3>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Titre:</span> {formData.title}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Catégorie:</span> {formData.category}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span> {formData.date}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Horaires:</span> {formData.time_start} - {formData.time_end}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Durée:</span> {formData.duration} minutes
                </div>
                <div>
                  <span className="font-medium text-gray-700">Places:</span> {formData.spots_available}
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Adresse:</span> {formData.address}, {formData.postal_code} {formData.city}
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Contact:</span> {formData.contact_name} ({formData.contact_email})
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary"
              >
                Précédent
              </button>
              <div className="space-x-3">
                <button
                  type="button"
                  className="btn-outline"
                >
                  Enregistrer comme brouillon
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publication en cours...
                    </span>
                  ) : (
                    'Publier la mission'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CreateMissionPage;
