
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
import { Textarea } from "@/components/ui/textarea";
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
  const [organizationName, setOrganizationName] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  
  // Data from database
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [availableSectors, setAvailableSectors] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const { signUp } = useAuth();
  const { formData, saveFormData, clearFormData, updateField } = useFormPersistence('register');

  // Gestion des compétences sélectionnées
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Validation en temps réel
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const [skillsResponse, sectorsResponse, citiesResponse] = await Promise.all([
        supabase.from("skills").select("id, name").order("name"),
        supabase.from("organization_sectors").select("id, name").order("name"),
        supabase.from("cities").select("id, name, postal_code").order("name")
      ]);

      setAvailableSkills(skillsResponse.data || []);
      setAvailableSectors(sectorsResponse.data || []);
      setAvailableCities(citiesResponse.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
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
      setOrganizationName(formData.organizationName || '');
      setSectorId(formData.sectorId || '');
      setAssoDesc(formData.assoDesc || '');
      setLocation(formData.location || '');
      setSelectedSkills(formData.selectedSkills || []);
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
      if (userType === "benevole") {
        if (!bio || !location) {
          setFormError("Merci de compléter tous les champs obligatoires.");
          return false;
        }
      } else {
        if (!organizationName || !assoDesc || !sectorId) {
          setFormError("Merci de compléter tous les champs obligatoires de l'association.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateStep()) {
      saveFormData({
        firstName, lastName, email, password, confirmPassword, bio, 
        website, phone, userType, step: step + 1, location, assoDesc,
        organizationName, sectorId, selectedSkills
      });
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    const newStep = step - 1;
    saveFormData({
      firstName, lastName, email, password, confirmPassword, bio, 
      website, phone, userType, step: newStep, location, assoDesc,
      organizationName, sectorId, selectedSkills
    });
    setStep(newStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsLoading(true);
    
    try {
      if (userType === "association") {
        // Créer le profil d'association
        const userData = {
          first_name: organizationName,
          last_name: "Association",
          is_association: true,
          is_organization: true,
          organization_data: {
            organization_name: organizationName,
            description: assoDesc,
            website_url: website,
            phone: phone,
            sector_id: sectorId
          }
        };
        
        const result = await signUp(email, password, userData);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        // Créer le profil de bénévole
        const userData = {
          first_name: firstName,
          last_name: lastName,
          bio,
          location,
          skills: selectedSkills,
          is_association: false,
          is_organization: false,
          phone: phone
        };

        const result = await signUp(email, password, userData);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
      }
      
      toast.success("Inscription réussie ! Bienvenue sur la plateforme.");
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

  if (isLoadingData) {
    return <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>;
  }

  return (
    <form onSubmit={step === steps.length - 1 ? handleSubmit : handleNext} className="space-y-6 max-w-xl mx-auto">
      {/* Indicateur d'étape */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${i <= step ? 'bg-primary' : 'bg-gray-300'}`}>{i + 1}</div>
            <span className={`text-xs mt-1 ${i === step ? 'text-primary font-semibold' : 'text-gray-400'}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Étape 1 : Choix du rôle */}
      {step === 0 && (
        <div className="flex flex-col gap-6 items-center">
          <h2 className="text-xl font-bold text-primary">Quel est votre rôle ?</h2>
          <div className="flex gap-6">
            <Button 
              type="button" 
              className={`px-8 py-4 rounded-lg border ${userType === 'benevole' ? 'bg-primary text-white' : 'bg-white text-primary border-primary'}`} 
              onClick={() => setUserType('benevole')}
            >
              Bénévole
            </Button>
            <Button 
              type="button" 
              className={`px-8 py-4 rounded-lg border ${userType === 'association' ? 'bg-primary text-white' : 'bg-white text-primary border-primary'}`} 
              onClick={() => setUserType('association')}
            >
              Association
            </Button>
          </div>
          <Button type="button" className="mt-8 w-full bg-primary text-white" onClick={handleNext}>Suivant</Button>
        </div>
      )}

      {/* Étape 2 : Infos de base */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary mb-4">Informations de base</h2>
          
          {userType === "association" ? (
            <div className="space-y-2">
              <Label htmlFor="organizationName">Nom de l'association *</Label>
              <Input 
                id="organizationName" 
                value={organizationName} 
                onChange={e => setOrganizationName(e.target.value)} 
                required 
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          
          {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button type="button" className="bg-primary text-white" onClick={handleNext}>Suivant</Button>
          </div>
        </div>
      )}

      {/* Étape 3 : Infos complémentaires */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary mb-4">Informations complémentaires</h2>
          
          {userType === "benevole" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Courte biographie *</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Ville *</Label>
                <Select onValueChange={value => setLocation(value)} value={location}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(city => (
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
                          onClick={() => handleSkillToggle(skillId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Select onValueChange={handleSkillToggle}>
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
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="assoDesc">Description de l'association *</Label>
                <Textarea id="assoDesc" value={assoDesc} onChange={e => setAssoDesc(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d'activité *</Label>
                <Select onValueChange={setSectorId} value={sectorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectors.map(sector => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </>
          )}
          
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button type="button" className="bg-primary text-white" onClick={handleNext}>Suivant</Button>
          </div>
        </div>
      )}

      {/* Étape 4 : Récapitulatif */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary mb-4">Récapitulatif</h2>
          <ul className="space-y-2 text-gray-700">
            <li><b>Rôle :</b> {userType === 'benevole' ? 'Bénévole' : 'Association'}</li>
            {userType === 'benevole' ? (
              <>
                <li><b>Nom :</b> {firstName} {lastName}</li>
                <li><b>Bio :</b> {bio}</li>
                <li><b>Localisation :</b> {location}</li>
                <li><b>Compétences :</b> {selectedSkills.length} sélectionnées</li>
              </>
            ) : (
              <>
                <li><b>Nom de l'association :</b> {organizationName}</li>
                <li><b>Description :</b> {assoDesc}</li>
                <li><b>Secteur :</b> {availableSectors.find(s => s.id === sectorId)?.name}</li>
                <li><b>Site web :</b> {website}</li>
              </>
            )}
            <li><b>Email :</b> {email}</li>
            <li><b>Téléphone :</b> {phone}</li>
          </ul>
          
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrev}>Précédent</Button>
            <Button 
              type="submit" 
              className="bg-primary text-white" 
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
          <Link to="/auth/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
