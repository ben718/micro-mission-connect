
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { user, loading, isLoading } = useAuth();
  
  // Afficher un loader pendant que nous vérifions l'état d'authentification
  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-bleu animate-spin mb-4" />
        <p>Chargement...</p>
      </div>
    );
  }

  // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
  if (user) {
    console.log("[Login] Utilisateur déjà connecté, redirection vers l'accueil");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-custom py-10 min-h-screen flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
