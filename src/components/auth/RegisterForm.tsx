
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("benevole");
  const [passwordError, setPasswordError] = useState("");
  const { signUp } = useAuth();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        bio,
        is_association: userType === "association"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="benevole" onValueChange={setUserType}>
        <TabsList className="w-full mb-2">
          <TabsTrigger value="benevole" className="w-1/2">Bénévole</TabsTrigger>
          <TabsTrigger value="association" className="w-1/2">Association</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {userType === "association" ? "Nom de l'association" : "Prénom"}
          </Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            {userType === "association" ? "Type d'association" : "Nom"}
          </Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">
          {userType === "association" ? "Description de l'association" : "Courte biographie"}
        </Label>
        <Input
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {passwordError && (
        <div className="text-red-500 text-sm">{passwordError}</div>
      )}

      <Button
        type="submit"
        className="w-full bg-bleu hover:bg-bleu-700"
        disabled={isLoading}
      >
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </Button>

      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          Déjà un compte?{" "}
          <Link to="/auth/login" className="text-bleu hover:underline">
            Se connecter
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
