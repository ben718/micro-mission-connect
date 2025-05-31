
import { Separator } from "@/components/ui/separator";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-bleu mb-6">
            Offrez votre temps – Même 15 minutes comptent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Je m'appelle Ben Mvouama.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story Section */}
          <div className="prose prose-lg prose-blue max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">
              Quand je suis arrivé en France avec ma famille, nous n'avions presque rien.
              Pas de repères, peu de ressources, et beaucoup d'inquiétudes sur l'avenir.
              Mais des associations étaient là.
              Les Restos du Cœur, la Croix-Rouge, La Maison des Femmes...
              Grâce à elles, nous avons pu manger, nous soigner, trouver du soutien, et tout simplement vivre avec dignité.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Sans leur présence, leur écoute, et l'engagement des bénévoles, notre parcours aurait été bien plus dur.
              Ces personnes ne nous connaissaient pas, mais elles ont donné de leur temps.
              Et ce temps nous a permis de tenir debout.
            </p>
          </div>

          <Separator className="my-12" />

          {/* Why Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              Pourquoi ce projet
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Aujourd'hui, je vais mieux. Ma famille aussi.
              Et une chose m'est restée en tête :
            </p>
            <blockquote className="text-2xl font-semibold text-center text-bleu italic border-l-4 border-orange pl-6 my-8">
              "Comment rendre ce que j'ai reçu ?"
            </blockquote>
            
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Mais en parlant autour de moi, je me suis rendu compte que beaucoup de gens veulent aider, mais ne savent pas comment :
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
              <li>"Je n'ai pas le temps."</li>
              <li>"Je ne sais pas où chercher."</li>
              <li>"Je ne sais pas ce que je peux apporter."</li>
            </ul>
            <p className="text-lg leading-relaxed text-gray-700">
              Alors j'ai décidé de créer Offrez votre temps, une plateforme qui casse ces barrières.
              Un site où même 15 minutes peuvent devenir utiles.
              Un site pour tous ceux qui veulent aider, mais ne savent pas par où commencer.
              Un pont entre les personnes prêtes à donner un peu de leur énergie, et les associations qui en ont besoin.
            </p>
          </div>

          <Separator className="my-12" />

          {/* Beliefs Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-8">
              Ce que nous croyons
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  Chaque minute peut changer une vie.
                </h3>
                <p className="text-gray-600">
                  Il n'est pas nécessaire d'avoir beaucoup pour offrir quelque chose.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-bleu mb-3">
                  L'engagement doit être simple, accessible et humain.
                </h3>
                <p className="text-gray-600">
                  Le bénévolat ne doit pas être réservé à ceux qui ont du temps ou de l'expérience.
                </p>
              </div>
              <div className="text-center md:col-span-2">
                <p className="text-lg text-gray-700">
                  Nous croyons qu'aider doit être aussi naturel que tendre la main.
                  Et que si chacun donne un peu, on peut faire beaucoup.
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* What we do Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              Ce que nous faisons
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                • Nous permettons aux bénévoles de trouver des missions proches de chez eux, selon leur emploi du temps, leurs envies et leurs compétences.
              </p>
              <p className="text-lg text-gray-700">
                • Nous aidons les associations à recruter facilement des personnes engagées, même pour des actions ponctuelles.
              </p>
              <p className="text-lg text-gray-700">
                • Nous valorisons les petits engagements : 15 minutes, une heure, une soirée… tout compte.
              </p>
              <p className="text-lg text-gray-700">
                • Nous construisons une communauté de solidarité, locale et inclusive.
              </p>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Platform Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              Une plateforme humaine et simple
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Offrez votre temps n'est pas une grande entreprise.
              C'est un projet né d'une histoire vraie, porté par une volonté simple : faciliter l'entraide.
            </p>
            <p className="text-lg text-gray-700">
              Nous utilisons la technologie (et un peu d'intelligence artificielle) pour créer du lien humain, pas pour le remplacer.
            </p>
          </div>

          <Separator className="my-12" />

          {/* Target audience Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              À qui s'adresse ce site ?
            </h2>
            <div className="space-y-3">
              <p className="text-lg text-gray-700">
                • À toi, étudiant qui a 30 minutes entre deux cours.
              </p>
              <p className="text-lg text-gray-700">
                • À toi, parent, qui veux aider une cause locale pendant que tes enfants sont à l'école.
              </p>
              <p className="text-lg text-gray-700">
                • À toi, retraité, qui veux transmettre ton expérience et ton énergie.
              </p>
              <p className="text-lg text-gray-700">
                • À toi, salarié, qui veux agir sur ton temps libre, même un peu.
              </p>
              <p className="text-lg text-gray-700">
                • Et à toutes les associations, petites ou grandes, qui manquent de bras pour agir.
              </p>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Conclusion Section */}
          <div>
            <h2 className="text-3xl font-bold text-bleu mb-6">
              Ce n'est que le début
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Ce projet, je le construis avec vous.
              Il évoluera, grandira, et s'améliorera grâce à vos retours, vos idées, vos histoires.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Rejoignez-nous. Partagez votre temps. Même un petit peu.
            </p>
            <blockquote className="text-xl font-semibold text-center text-bleu italic border-l-4 border-orange pl-6 my-8">
              Car si les associations sauvent des vies,<br />
              ce sont des gens comme vous qui leur en donnent les moyens.
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
