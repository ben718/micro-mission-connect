import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Géolocalisation intelligente',
      description: 'Trouvez des missions près de chez vous en temps réel'
    },
    {
      icon: Clock,
      title: 'Flexibilité totale',
      description: 'Même 15 minutes peuvent faire la différence'
    },
    {
      icon: Users,
      title: 'Matching instantané',
      description: 'Connectez-vous avec les bonnes associations'
    }
  ];

  const testimonials = [
    {
      name: 'Marie L.',
      role: 'Bénévole active',
      content: 'Grâce à Voisin Solidaire, j\'ai pu aider 12 associations en 3 mois. L\'interface est intuitive et les missions sont vraiment adaptées à mon emploi du temps.',
      rating: 5
    },
    {
      name: 'Association Les Petits Cœurs',
      role: 'Organisation',
      content: 'Nous avons trouvé 25 bénévoles en 2 semaines ! La plateforme nous a permis d\'organiser nos événements beaucoup plus facilement.',
      rating: 5
    },
    {
      name: 'Thomas R.',
      role: 'Nouveau bénévole',
      content: 'Je n\'avais jamais fait de bénévolat. Voisin Solidaire m\'a guidé vers ma première mission. Maintenant j\'y consacre 2h par semaine !',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              L'Uber du bénévolat
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trouvez votre mission de
              <span className="block text-yellow-300">bénévolat en 2 clics</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connectez-vous instantanément avec des associations près de chez vous. 
              Même 15 minutes peuvent changer une vie.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Accéder au Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                      Commencer maintenant
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/missions">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                      Voir les missions
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">2,847</div>
                <div className="text-blue-200">Missions réalisées</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1,234</div>
                <div className="text-blue-200">Bénévoles actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold">156</div>
                <div className="text-blue-200">Associations partenaires</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Voisin Solidaire ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme moderne qui révolutionne le bénévolat avec une approche on-demand
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de notre communauté
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de bénévoles qui changent le monde, une mission à la fois.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user && (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                    <CheckCircle className="mr-2 w-5 h-5" />
                    Inscription gratuite
                  </Button>
                </Link>
                <Link to="/missions">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3">
                    Explorer les missions
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            ✓ Gratuit et sans engagement ✓ Missions vérifiées ✓ Support 7j/7
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

