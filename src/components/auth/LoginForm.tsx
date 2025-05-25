
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérification basique des champs
    if (!email || !email.includes('@')) {
      toast.error("Veuillez entrer une adresse e-mail valide");
      return;
    }
    
    if (!password || password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await signIn(email, password);
      // La navigation est gérée dans le hook useAuth
    } catch (error: any) {
      console.error("[LoginForm] Erreur lors de la connexion:", error);
      // Les erreurs sont déjà affichées dans useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link to="/auth/reset-password" className="text-sm text-bleu hover:underline">
            Mot de passe oublié?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-bleu hover:bg-bleu-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          Pas encore de compte?{" "}
          <Link to="/auth/register" className="text-bleu hover:underline">
            Créer un compte
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
