
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Clock, Users, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bleu-700 to-bleu py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Offrez votre temps – Même 15 minutes comptent
            </h1>
            <p className="text-xl sm:text-2xl text-blue-50 font-light">
              Je m'appelle Ben Mvouama.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-12">
              <CardContent className="p-8 sm:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Quand je suis arrivé en France avec ma famille, nous n'avions presque rien.
                    Pas de repères, peu de ressources, et beaucoup d'inquiétudes sur l'avenir.
                    Mais des associations étaient là.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Les Restos du Cœur, la Croix-Rouge, La Maison des Femmes...
                    Grâce à elles, nous avons pu manger, nous soigner, trouver du soutien, et tout simplement vivre avec dignité.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Sans leur présence, leur écoute, et l'engagement des bénévoles, notre parcours aurait été bien plus dur.
                    Ces personnes ne nous connaissaient pas, mais elles ont donné de leur temps.
                    Et ce temps nous a permis de tenir debout.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pourquoi ce projet */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pourquoi ce projet</h2>
              <Card>
                <CardContent className="p-8 sm:p-12">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Aujourd'hui, je vais mieux. Ma famille aussi.
                    Et une chose m'est restée en tête :
                  </p>
                  <blockquote className="text-2xl font-medium text-bleu text-center my-8 italic">
                    "Comment rendre ce que j'ai reçu ?"
                  </blockquote>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Mais en parlant autour de moi, je me suis rendu compte que beaucoup de gens veulent aider, mais ne savent pas comment :
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <ul className="space-y-3">
                      <li className="text-gray-600 italic">"Je n'ai pas le temps."</li>
                      <li className="text-gray-600 italic">"Je ne sais pas où chercher."</li>
                      <li className="text-gray-600 italic">"Je ne sais pas ce que je peux apporter."</li>
                    </ul>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Alors j'ai décidé de créer <strong>Offrez votre temps</strong>, une plateforme qui casse ces barrières.
                    Un site où même 15 minutes peuvent devenir utiles.
                    Un site pour tous ceux qui veulent aider, mais ne savent pas par où commencer.
                    Un pont entre les personnes prêtes à donner un peu de leur énergie, et les associations qui en ont besoin.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ce que nous croyons */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ce que nous croyons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Clock className="w-8 h-8 text-bleu mr-3" />
                      <h3 className="font-semibold text-lg">Chaque minute compte</h3>
                    </div>
                    <p className="text-gray-600">Chaque minute peut changer une vie.</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Heart className="w-8 h-8 text-bleu mr-3" />
                      <h3 className="font-semibold text-lg">Donner sans avoir beaucoup</h3>
                    </div>
                    <p className="text-gray-600">Il n'est pas nécessaire d'avoir beaucoup pour offrir quelque chose.</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Users className="w-8 h-8 text-bleu mr-3" />
                      <h3 className="font-semibold text-lg">Engagement accessible</h3>
                    </div>
                    <p className="text-gray-600">L'engagement doit être simple, accessible et humain.</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Target className="w-8 h-8 text-bleu mr-3" />
                      <h3 className="font-semibold text-lg">Pour tous</h3>
                    </div>
                    <p className="text-gray-600">Le bénévolat ne doit pas être réservé à ceux qui ont du temps ou de l'expérience.</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-8">
                <CardContent className="p-8 text-center">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Nous croyons qu'aider doit être aussi naturel que tendre la main.
                    Et que si chacun donne un peu, on peut faire beaucoup.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Ce que nous faisons */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ce que nous faisons</h2>
              <Card>
                <CardContent className="p-8 sm:p-12">
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-bleu rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <p className="text-lg text-gray-700">
                        Nous permettons aux bénévoles de trouver des missions proches de chez eux, selon leur emploi du temps, leurs envies et leurs compétences.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-bleu rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <p className="text-lg text-gray-700">
                        Nous aidons les associations à recruter facilement des personnes engagées, même pour des actions ponctuelles.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-bleu rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <p className="text-lg text-gray-700">
                        Nous valorisons les petits engagements : 15 minutes, une heure, une soirée… tout compte.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-bleu rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <p className="text-lg text-gray-700">
                        Nous construisons une communauté de solidarité, locale et inclusive.
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Une plateforme humaine */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Une plateforme humaine et simple</h2>
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    <strong>Offrez votre temps</strong> n'est pas une grande entreprise.
                    C'est un projet né d'une histoire vraie, porté par une volonté simple : faciliter l'entraide.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Nous utilisons la technologie (et un peu d'intelligence artificielle) pour créer du lien humain, pas pour le remplacer.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* À qui s'adresse ce site */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">À qui s'adresse ce site ?</h2>
              <Card>
                <CardContent className="p-8 sm:p-12">
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">À toi, étudiant qui a 30 minutes entre deux cours.</p>
                    <p className="text-lg text-gray-700">À toi, parent, qui veux aider une cause locale pendant que tes enfants sont à l'école.</p>
                    <p className="text-lg text-gray-700">À toi, retraité, qui veux transmettre ton expérience et ton énergie.</p>
                    <p className="text-lg text-gray-700">À toi, salarié, qui veux agir sur ton temps libre, même un peu.</p>
                    <p className="text-lg text-gray-700 font-medium">Et à toutes les associations, petites ou grandes, qui manquent de bras pour agir.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ce n'est que le début */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ce n'est que le début</h2>
              <Card className="bg-gradient-to-r from-bleu-50 to-blue-50">
                <CardContent className="p-8 sm:p-12 text-center">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Ce projet, je le construis avec vous.
                    Il évoluera, grandira, et s'améliorera grâce à vos retours, vos idées, vos histoires.
                  </p>
                  <p className="text-xl font-medium text-bleu mb-6">
                    Rejoignez-nous. Partagez votre temps. Même un petit peu.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed italic">
                    Car si les associations sauvent des vies,
                    ce sont des gens comme vous qui leur en donnent les moyens.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
