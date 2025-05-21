
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

const testimonials = [
  {
    quote: "MicroBénévole m'a permis d'intégrer le bénévolat dans mon quotidien chargé. Je peux aider quand j'ai un moment, sans culpabiliser les jours où je ne suis pas disponible.",
    author: "Marie L.",
    role: "Bénévole, Infirmière",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
  {
    quote: "Grâce à cette plateforme, notre association a pu trouver des volontaires pour des tâches ponctuelles que nous n'aurions pas pu réaliser seuls. Un vrai gain de temps et d'efficacité !",
    author: "Thomas D.",
    role: "Responsable, Les Restos du Cœur",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    quote: "J'ai pu valider des compétences réelles en communication tout en aidant une cause qui me tient à cœur. Les badges obtenus valorisent mon profil professionnel de façon concrète.",
    author: "Julie M.",
    role: "Étudiante en marketing",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    quote: "L'application est intuitive et nous permet de poster rapidement nos besoins. En quelques minutes, nous avons souvent plusieurs volontaires qui se manifestent. Impressionnant !",
    author: "Pascal R.",
    role: "Directeur, Association Environnement Vert",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

const TestimonialsSection = () => {
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
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <Quote className="h-8 w-8 text-bleu-200 mb-4" />
                      <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                    </div>
                    <div className="flex items-center mt-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
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
