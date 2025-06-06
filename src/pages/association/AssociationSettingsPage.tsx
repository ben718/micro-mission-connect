import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AssociationSettings {
  name: string;
  description: string;
  logo_url: string;
  address: string;
  city: string;
  postal_code: string;
  website: string;
  phone: string;
  email: string;
  categories: string[];
  contact_person: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  notification_preferences: {
    new_volunteer: boolean;
    mission_reminder: boolean;
    mission_completed: boolean;
    platform_updates: boolean;
  };
}

const AssociationSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<AssociationSettings>({
    name: '',
    description: '',
    logo_url: '',
    address: '',
    city: '',
    postal_code: '',
    website: '',
    phone: '',
    email: '',
    categories: [],
    contact_person: {
      name: '',
      role: '',
      email: '',
      phone: ''
    },
    notification_preferences: {
      new_volunteer: true,
      mission_reminder: true,
      mission_completed: true,
      platform_updates: false
    }
  });
  
  // Simuler le chargement des données depuis Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Dans une implémentation réelle, nous récupérerions les données depuis Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées
        const mockSettings: AssociationSettings = {
          name: 'Les Restos du Cœur',
          description: 'Association d\'aide alimentaire et d\'insertion sociale, fondée par Coluche en 1985.',
          logo_url: 'https://example.com/logo.png',
          address: '42 Rue de la Solidarité',
          city: 'Paris',
          postal_code: '75001',
          website: 'https://www.restosducoeur.org',
          phone: '01 23 45 67 89',
          email: 'contact@restosducoeur.org',
          categories: ['Social', 'Alimentaire', 'Insertion'],
          contact_person: {
            name: 'Marie Dupont',
            role: 'Coordinatrice',
            email: 'marie.dupont@restosducoeur.org',
            phone: '06 12 34 56 78'
          },
          notification_preferences: {
            new_volunteer: true,
            mission_reminder: true,
            mission_completed: true,
            platform_updates: false
          }
        };
        
        setSettings(mockSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSettings(prev => ({
      ...prev,
      contact_person: {
        ...prev.contact_person,
        [name]: value
      }
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [name]: checked
      }
    }));
  };
  
  const handleCategoryChange = (category: string) => {
    setSettings(prev => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category]
        };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Dans une implémentation réelle, nous enverrions les données à Supabase
      console.log('Données à sauvegarder:', settings);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Afficher un message de succès
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      alert('Erreur lors de la sauvegarde des paramètres.');
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Paramètres de l'association</h1>
        <Link to="/association/dashboard" className="text-vs-blue-primary">
          Retour au tableau de bord
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vs-blue-primary"></div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'profile' ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profil
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'contact' ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'notifications' ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'team' ? 'text-vs-blue-primary border-b-2 border-vs-blue-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('team')}
            >
              Équipe
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'association *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={settings.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
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
                    value={settings.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL du logo
                  </label>
                  <input
                    id="logo_url"
                    name="logo_url"
                    type="text"
                    value={settings.logo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={settings.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
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
                      value={settings.city}
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
                      value={settings.postal_code}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories d'intervention *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Social', 'Environnement', 'Éducation', 'Santé', 'Culture', 'Sport', 'Alimentaire', 'Insertion', 'Autre'].map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          id={`category-${category}`}
                          type="checkbox"
                          checked={settings.categories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Onglet Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={settings.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={settings.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personne à contacter</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        id="contact_name"
                        name="name"
                        type="text"
                        value={settings.contact_person.name}
                        onChange={handleContactChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact_role" className="block text-sm font-medium text-gray-700 mb-1">
                        Fonction *
                      </label>
                      <input
                        id="contact_role"
                        name="role"
                        type="text"
                        value={settings.contact_person.role}
                        onChange={handleContactChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        id="contact_email"
                        name="email"
                        type="email"
                        value={settings.contact_person.email}
                        onChange={handleContactChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone *
                      </label>
                      <input
                        id="contact_phone"
                        name="phone"
                        type="tel"
                        value={settings.contact_person.phone}
                        onChange={handleContactChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vs-blue-primary focus:border-vs-blue-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Onglet Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de notification</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="new_volunteer"
                        name="new_volunteer"
                        type="checkbox"
                        checked={settings.notification_preferences.new_volunteer}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="new_volunteer" className="font-medium text-gray-700">Nouveaux bénévoles</label>
                      <p className="text-gray-500">Recevoir une notification lorsqu'un bénévole s'inscrit à une mission</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="mission_reminder"
                        name="mission_reminder"
                        type="checkbox"
                        checked={settings.notification_preferences.mission_reminder}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="mission_reminder" className="font-medium text-gray-700">Rappels de mission</label>
                      <p className="text-gray-500">Recevoir un rappel la veille d'une mission</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="mission_completed"
                        name="mission_completed"
                        type="checkbox"
                        checked={settings.notification_preferences.mission_completed}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="mission_completed" className="font-medium text-gray-700">Missions terminées</label>
                      <p className="text-gray-500">Recevoir une notification lorsqu'une mission est terminée</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="platform_updates"
                        name="platform_updates"
                        type="checkbox"
                        checked={settings.notification_preferences.platform_updates}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 text-vs-blue-primary focus:ring-vs-blue-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="platform_updates" className="font-medium text-gray-700">Mises à jour de la plateforme</label>
                      <p className="text-gray-500">Recevoir des notifications sur les nouvelles fonctionnalités</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Canaux de notification</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Email</h4>
                        <p className="text-xs text-gray-500">Notifications par email</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle-email" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked />
                        <label htmlFor="toggle-email" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">SMS</h4>
                        <p className="text-xs text-gray-500">Notifications par SMS</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input type="checkbox" name="toggle" id="toggle-sms" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                        <label htmlFor="toggle-sms" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Onglet Équipe */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Membres de l'équipe</h3>
                  <button type="button" className="btn-outline text-sm">
                    Ajouter un membre
                  </button>
                </div>
                
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Marie Dupont</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">marie.dupont@restosducoeur.org</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Administrateur
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button type="button" className="text-vs-blue-primary hover:text-vs-blue-dark mr-3">
                            Modifier
                          </button>
                          <button type="button" className="text-red-600 hover:text-red-900">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Thomas Martin</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">thomas.martin@restosducoeur.org</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Gestionnaire
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button type="button" className="text-vs-blue-primary hover:text-vs-blue-dark mr-3">
                            Modifier
                          </button>
                          <button type="button" className="text-red-600 hover:text-red-900">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Invitations en attente</h3>
                  
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rôle
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'envoi
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">sophie.bernard@example.com</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Gestionnaire
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">01/06/2025</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button type="button" className="text-vs-blue-primary hover:text-vs-blue-dark mr-3">
                              Renvoyer
                            </button>
                            <button type="button" className="text-red-600 hover:text-red-900">
                              Annuler
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  'Enregistrer les modifications'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default AssociationSettingsPage;
