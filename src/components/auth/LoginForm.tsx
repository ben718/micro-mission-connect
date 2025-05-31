
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !email.includes('@')) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }
    
    if (!password || password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setError(error.message || "Erreur de connexion");
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('[LoginForm] Error during sign in:', error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
          className="h-12"
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
          className="h-12"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-bleu hover:bg-bleu-700 h-12 text-base"
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
      
      <div className="text-center mt-6">
        <span className="text-sm text-gray-500">
          Pas encore de compte?{" "}
          <Link to="/auth/register" className="text-bleu hover:underline font-medium">
            Créer un compte
          </Link>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
