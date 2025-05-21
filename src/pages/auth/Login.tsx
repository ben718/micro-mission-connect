
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (user) {
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
