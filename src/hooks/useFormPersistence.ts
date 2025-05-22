import { useState, useEffect } from 'react';

const FORM_DATA_KEY = 'mb_form_data';

interface FormData {
  [key: string]: any;
}

export const useFormPersistence = (formId: string) => {
  const [formData, setFormData] = useState<FormData>({});

  // Charger les données sauvegardées au montage
  useEffect(() => {
    const savedData = localStorage.getItem(`${FORM_DATA_KEY}_${formId}`);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données du formulaire:', error);
        localStorage.removeItem(`${FORM_DATA_KEY}_${formId}`);
      }
    }
  }, [formId]);

  // Sauvegarder les données
  const saveFormData = (data: FormData) => {
    try {
      localStorage.setItem(`${FORM_DATA_KEY}_${formId}`, JSON.stringify(data));
      setFormData(data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données du formulaire:', error);
    }
  };

  // Effacer les données sauvegardées
  const clearFormData = () => {
    localStorage.removeItem(`${FORM_DATA_KEY}_${formId}`);
    setFormData({});
  };

  // Mettre à jour un champ spécifique
  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    saveFormData(newData);
  };

  return {
    formData,
    saveFormData,
    clearFormData,
    updateField,
  };
}; 