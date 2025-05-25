
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div className="container-custom py-10 min-h-screen flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Vérifiez votre email</h1>
        <p className="mb-6">
          Nous vous avons envoyé un lien de confirmation par email. Veuillez cliquer sur ce lien pour confirmer votre compte.
        </p>
        <p className="mb-8 text-sm text-gray-500">
          Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.
        </p>
        <Button asChild className="bg-bleu hover:bg-bleu-700">
          <Link to="/auth/login">Retour à la connexion</Link>
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
