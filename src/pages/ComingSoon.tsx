
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Heart, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-bleu to-bleu-400 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-bleu mb-4">
              Bientôt disponible
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Cette fonctionnalité arrive prochainement sur MicroBénévole
            </p>
          </div>

          {/* Features Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bleu">
                  <Zap className="w-5 h-5" />
                  En développement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous travaillons activement sur cette fonctionnalité pour vous offrir la meilleure expérience possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bleu">
                  <Heart className="w-5 h-5" />
                  Votre avis compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vos retours nous aident à améliorer continuellement la plateforme.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h2 className="text-2xl font-semibold text-bleu mb-4">
              En attendant...
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez toutes les missions disponibles et rejoignez notre communauté de bénévoles engagés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/missions">
                  Voir les missions
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
