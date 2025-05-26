import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDynamicLists } from "@/hooks/useDynamicLists";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  validateEmail,
  validatePassword,
  validateWebsite,
  validatePhone,
  validateRequired,
  validateMinLength,
} from "@/utils/validation";

const steps = [
  "Choix du rôle",
  "Informations de base",
  "Informations complémentaires",
  "Récapitulatif"
];

const RegisterForm = () => {
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<"benevole" | "association">("benevole");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [assoDesc, setAssoDesc] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const { signUp } = useAuth();
  const { categories: availableCategories, cities, skills: availableSkills, isLoading: isLoadingLists, error: listsError } = useDynamicLists();
  const { formData, saveFormData, clearFormData, updateField } = useFormPersistence('register');

  // Gestion des compétences sélectionnées
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Gestion des catégories sélectionnées
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Validation en temps réel
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSkillSelect = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    setSkillInput("");
  };

  const handleSkillRemove = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const handleCategorySelect = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (!validateEmail(value)) {
          error = 'Format d\'email invalide';
        }
        break;
      case 'password':
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          error = passwordValidation.message || 'Mot de passe invalide';
        }
        break;
      case 'website':
        if (value && !validateWebsite(value)) {
          error = 'URL invalide';
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'Numéro de téléphone invalide';
        }
        break;
      case 'bio':
        if (!validateMinLength(value, 10)) {
          error = 'La biographie doit contenir au moins 10 caractères';
        }
        break;
      case 'assoDesc':
        if (!validateMinLength(value, 20)) {
          error = 'La description doit contenir au moins 20 caractères';
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  // Mise à jour des champs avec validation
  const handleFieldChange = (field: string, value: string) => {
    validateField(field, value);
    updateField(field, value);
    
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      case 'bio':
        setBio(value);
        break;
      case 'website':
        setWebsite(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'assoDesc':
        setAssoDesc(value);
        break;
    }
  };

  // Charger les données sauvegardées
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setFirstName(formData.firstName || '');
      setLastName(formData.lastName || '');
      setEmail(formData.email || '');
      setPassword(formData.password || '');
      setConfirmPassword(formData.confirmPassword || '');
      setBio(formData.bio || '');
      setWebsite(formData.website || '');
      setPhone(formData.phone || '');
      setUserType(formData.userType || 'benevole');
      setStep(formData.step || 0);
    }
  }, [formData]);

  const validateStep = () => {
    setPasswordError("");
    setFormError("");
    if (step === 1) {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setFormError("Tous les champs sont obligatoires.");
        return false;
      }
      if (password !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas");
        return false;
      }
      if (password.length < 6) {
        setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
        return false;
      }
    }
    if (step === 2) {
      if (userType === "benevole" && !bio) {
        setFormError("Merci d'ajouter une courte biographie.");
        return false;
      }
      if (userType === "association" && (!assoDesc || !website)) {
        setFormError("Merci de compléter la description et le site web de l'association.");
        return false;
      }
    }
    return true;
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep()) {
      saveFormData({
        firstName, lastName, email, password, confirmPassword, bio, 
        website, phone, userType, step: step + 1, location, assoDesc
      });
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    const newStep = step - 1;
    saveFormData({
      firstName, lastName, email, password, confirmPassword, bio, 
      website, phone, userType, step: newStep, location, assoDesc
    });
    setStep(newStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    
    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        bio,
        location,
        skills: selectedSkills,
        is_association: userType === "association",
        association_description: assoDesc,
        website,
        phone,
        categories: selectedCategories,
      };

      console.log("Tentative d'inscription avec les données:", userData);
      
      const result = await signUp(email, password, userData);
      
      if (result.error) {
        console.error("Erreur d'inscription:", result.error);
        throw new Error(result.error.message);
      }
      
      toast.success("Inscription réussie ! Bienvenue sur MicroBénévole.");
      clearFormData();
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
      const errorMessage = err.message || "Erreur lors de l'inscription";
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={step === steps.length - 1 ? handleSubmit : handleNext} className="space-y-6 max-w-xl mx-auto">
      {/* Indicateur d'étape */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${i <= step ? 'bg-bleu' : 'bg-gray-300'}`}>{i + 1}</div>
            <span className={`text-xs mt-1 ${i === step ? 'text-bleu font-semibold' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Étape 1 : Choix du rôle */}
      {step === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-xl font-bold text-bleu">Quel est votre rôle ?</h2>
          <div className="flex gap-6">
            <Button 
              type="button" 
              className={`px-8 py-4 rounded-lg border ${userType === 'benevole' ? 'bg-bleu text-white' : 'bg-white text-bleu border-bleu'}`} 
              onClick={() => {
                setUserType('benevole');
                updateField('userType', 'benevole');
              }}
            >
              Bénévole
            </Button>
            <Button 
              type="button" 
              className={`px-8 py-4 rounded-lg border ${userType === 'association' ? 'bg-bleu text-white' : 'bg-white text-bleu border-bleu'}`} 
              onClick={() => {
                setUserType('association');
                updateField('userType', 'association');
              }}
            >
              Association
            </Button>
          </div>
          <Button type="button" className="mt-8 w-full bg-bleu text-white" onClick={handleNext}>Suivant</Button>
        </div>
      )}

      {/* Étape 2 : Infos de base */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-bleu mb-4">Informations de base</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{userType === "association" ? "Nom de l'association" : "Prénom"}</Label>
              <Input id="firstName" value={firstName} onChange={e => handleFieldChange('firstName', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{userType === "association" ? "Type d'association" : "Nom"}</Label>
              <Input id="lastName" value={lastName} onChange={e => handleFieldChange('lastName', e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={e => handleFieldChange('email', e.target.value)}
              required
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm">{validationErrors.email}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={e => handleFieldChange('password', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => handleFieldChange('confirmPassword', e.target.value)} required />
            </div>
          </div>
          {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button type="button" className="bg-bleu text-white" onClick={handleNext}>Suivant</Button>
          </div>
        </div>
      )}

      {/* Étape 3 : Infos complémentaires */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-bleu mb-4">Informations complémentaires</h2>
          {userType === "benevole" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Courte biographie</Label>
                <Input id="bio" value={bio} onChange={e => handleFieldChange('bio', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ville</Label>
                <Select onValueChange={value => handleFieldChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.id} value={city.name}>
                        {city.name} ({city.postal_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Compétences</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSkills.map(skillId => {
                    const skill = availableSkills.find(s => s.id === skillId);
                    return skill ? (
                      <Badge key={skillId} variant="secondary" className="flex items-center gap-1">
                        {skill.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleSkillRemove(skillId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Select
                  value={skillInput}
                  onValueChange={handleSkillSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter une compétence" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills
                      .filter(skill => !selectedSkills.includes(skill.id))
                      .map(skill => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="assoDesc">Description de l'association</Label>
                <Input id="assoDesc" value={assoDesc} onChange={e => handleFieldChange('assoDesc', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Catégories d'activités</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map(categoryId => {
                    const category = availableCategories.find(c => c.id === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                        {category.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleCategoryRemove(categoryId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Select onValueChange={handleCategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories
                      .filter(category => !selectedCategories.includes(category.id))
                      .map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input id="website" value={website} onChange={e => handleFieldChange('website', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={e => handleFieldChange('phone', e.target.value)} />
              </div>
            </>
          )}
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {listsError && <div className="text-red-500 text-sm">{listsError ? listsError.message : ''}</div>}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button type="button" className="bg-bleu text-white" onClick={handleNext}>Suivant</Button>
          </div>
        </div>
      )}

      {/* Étape 4 : Récapitulatif */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-bleu mb-4">Récapitulatif</h2>
          <ul className="space-y-2 text-gray-700">
            <li><b>Rôle :</b> {userType === 'benevole' ? 'Bénévole' : 'Association'}</li>
            <li><b>Nom :</b> {firstName}</li>
            <li><b>{userType === 'association' ? "Type d'association" : "Nom"} :</b> {lastName}</li>
            <li><b>Email :</b> {email}</li>
            {userType === 'benevole' ? (
              <>
                <li><b>Bio :</b> {bio}</li>
                <li><b>Localisation :</b> {location}</li>
                <li><b>Compétences :</b> {selectedSkills.length} sélectionnées</li>
              </>
            ) : (
              <>
                <li><b>Description :</b> {assoDesc}</li>
                <li><b>Site web :</b> {website}</li>
                <li><b>Téléphone :</b> {phone}</li>
                <li><b>Catégories :</b> {selectedCategories.length} sélectionnées</li>
              </>
            )}
          </ul>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button 
              type="submit" 
              className="bg-bleu text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "Valider et s'inscrire"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Lien vers connexion */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          Déjà un compte?{" "}
          <Link to="/auth/login" className="text-bleu hover:underline">
            Se connecter
          </Link>
        </span>
      </div>

      {/* Ajout du loader global */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-bleu animate-spin" />
            <p className="text-gray-700">Inscription en cours...</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
