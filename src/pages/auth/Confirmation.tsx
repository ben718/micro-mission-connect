
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail } from 'lucide-react';

const Confirmation = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <CardTitle className="text-center">Vérifiez votre email</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-blue-500" />
            </div>
            <p className="text-gray-600">
              Nous vous avons envoyé un email de confirmation. 
              Veuillez cliquer sur le lien dans l'email pour activer votre compte.
            </p>
            <p className="text-sm text-gray-500">
              Si vous ne voyez pas l'email, vérifiez votre dossier spam.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to="/login">
                  Retour à la connexion
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirmation;
