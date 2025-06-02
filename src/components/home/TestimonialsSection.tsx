
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

// Témoignages statiques de secours pour améliorer l'UX
const fallbackTestimonials = [
  {
    id: "1",
    quote: "Grâce à Voisin Solidaire, j'ai pu aider une association locale en seulement 30 minutes pendant ma pause déjeuner. C'est formidable de pouvoir contribuer même avec un emploi du temps chargé !",
    author_name: "Marie Dubois",
    author_role: "Bénévole, Développeuse",
    avatar_url: null
  },
  {
    id: "2", 
    quote: "Cette plateforme nous a permis de trouver rapidement des bénévoles pour nos événements ponctuels. L'interface est intuitive et les bénévoles sont très motivés.",
    author_name: "Jean-Pierre Martin",
    author_role: "Président, Association Solidarité Locale",
    avatar_url: null
  },
  {
    id: "3",
    quote: "J'adore le concept des micro-missions ! Cela me permet de m'engager selon mes disponibilités. J'ai déjà participé à 5 missions différentes ce mois-ci.",
    author_name: "Sophie Chen",
    author_role: "Bénévole, Étudiante",
    avatar_url: null
  },
  {
    id: "4",
    quote: "En tant qu'association, nous avons pu organiser notre distribution alimentaire grâce aux bénévoles trouvés sur la plateforme. Un grand merci !",
    author_name: "Ahmed Benali",
    author_role: "Coordinateur, Aide Alimentaire Paris",
    avatar_url: null
  }
];

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useTestimonials();

  // Utiliser les témoignages de la base de données s'ils existent, sinon utiliser les témoignages statiques
  const displayTestimonials = (testimonials && testimonials.length > 0) ? testimonials : fallbackTestimonials;

  if (isLoading) {
    return (
      <section className="section bg-white overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ils nous font confiance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez ce que disent nos bénévoles et les associations partenaires.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-64 w-full max-w-4xl rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez ce que disent nos bénévoles et les associations partenaires.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {displayTestimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 px-2">
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <Quote className="h-8 w-8 text-bleu-200 mb-4" />
                      <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow">
                        <AvatarImage src={testimonial.avatar_url || undefined} alt={testimonial.author_name} />
                        <AvatarFallback>{testimonial.author_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-semibold">{testimonial.author_name}</p>
                        <p className="text-sm text-gray-500">{testimonial.author_role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="mr-2" />
            <CarouselNext className="ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
