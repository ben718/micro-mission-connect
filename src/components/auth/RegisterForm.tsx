
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationSectors } from "@/hooks/useData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Loader2, User, Building } from "lucide-react";
import { toast } from "sonner";
import type { AuthData, UserRole } from "@/types";

const RegisterForm = () => {
  const [role, setRole] = useState<UserRole>("volunteer");
  const [formData, setFormData] = useState<AuthData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "volunteer",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();
  const { data: sectors, isLoading: sectorsLoading } = useOrganizationSectors();

  const handleInputChange = (field: keyof AuthData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      role,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.first_name) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }

    if (formData.password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (role === "organization" && !formData.organization_name) {
      toast.error("Le nom de l'organisation est obligatoire");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp({
        ...formData,
        role,
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Rejoignez notre communauté de bénévoles et d'associations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={role} onValueChange={(value) => setRole(value as UserRole)} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="volunteer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Bénévole
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Association
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="volunteer" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="organization" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="organization_name">Nom de l'association *</Label>
                <Input
                  id="organization_name"
                  value={formData.organization_name || ""}
                  onChange={(e) => handleInputChange("organization_name", e.target.value)}
                  required={role === "organization"}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d'activité</Label>
                <Select
                  value={formData.sector_id || ""}
                  onValueChange={(value) => handleInputChange("sector_id", value)}
                  disabled={isLoading || sectorsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors?.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization_description">Description</Label>
                <Textarea
                  id="organization_description"
                  value={formData.organization_description || ""}
                  onChange={(e) => handleInputChange("organization_description", e.target.value)}
                  placeholder="Décrivez votre association..."
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_first_name">Prénom du contact *</Label>
                  <Input
                    id="contact_first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_last_name">Nom du contact *</Label>
                  <Input
                    id="contact_last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Champs communs */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmer le mot de passe *</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création du compte...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>
        </Tabs>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/auth/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
