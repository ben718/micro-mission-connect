
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

const TestimonialsSection = () => {
  const { data: testimonials, isLoading, error } = useTestimonials();

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

  if (error || !testimonials || testimonials.length === 0) {
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
          <div className="text-center text-gray-500">
            <p>Aucun témoignage disponible pour le moment.</p>
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
            {testimonials.map((testimonial) => (
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
