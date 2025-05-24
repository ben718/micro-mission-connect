
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useDynamicLists";
import { useMissionTypes } from "@/hooks/useData";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Badge,
} from "@/components/ui/badge";
import {
  ChevronDown,
  Check,
  X,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  address: z.string().optional(),
  location: z.string().min(1, "La ville est requise"),
  postal_code: z.string().min(1, "Le code postal est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  start_time: z.string().min(1, "L'heure de début est requise"),
  duration_minutes: z.coerce.number().min(15, "La durée minimale est de 15 minutes"),
  available_spots: z.coerce.number().min(1, "Au moins une place doit être disponible"),
  format: z.string().min(1, "Le format est requis"),
  difficulty_level: z.string().min(1, "Le niveau de difficulté est requis"),
  engagement_level: z.string().min(1, "Le niveau d'engagement est requis"),
  mission_type_id: z.string().min(1, "Le type de mission est requis"),
  desired_impact: z.string().optional(),
});

const CreateMission = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: missionTypes = [] } = useMissionTypes();

  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      location: "",
      postal_code: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      duration_minutes: 60,
      available_spots: 1,
      format: "",
      difficulty_level: "",
      engagement_level: "",
      mission_type_id: "",
      desired_impact: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une mission");
      return;
    }

    // Vérifier qu'il existe un profil organisation pour cet utilisateur
    const { data: orgProfile } = await supabase
      .from("organization_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!orgProfile) {
      toast.error("Vous devez avoir un profil d'organisation pour créer des missions");
      return;
    }

    try {
      // Convertir la date et l'heure en objets Date
      const startDateTime = new Date(`${values.start_date}T${values.start_time}`);
      const endDateTime = addHours(startDateTime, values.duration_minutes / 60);

      // Insérer la mission
      const { data: mission, error } = await supabase
        .from("missions")
        .insert({
          title: values.title,
          description: values.description,
          address: values.address,
          location: values.location,
          postal_code: values.postal_code,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime.toISOString(),
          duration_minutes: values.duration_minutes,
          available_spots: values.available_spots,
          organization_id: orgProfile.id,
          mission_type_id: values.mission_type_id,
          format: values.format,
          difficulty_level: values.difficulty_level,
          engagement_level: values.engagement_level,
          desired_impact: values.desired_impact,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Mission créée avec succès");
      navigate(`/missions/${mission.id}`);
    } catch (error: any) {
      console.error("Erreur lors de la création de la mission:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création de la mission");
    }
  };

  const formValues = form.watch();

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Vous devez être connecté</h2>
          <p className="text-gray-500 mb-4">
            Connectez-vous pour créer une mission.
          </p>
          <Button asChild>
            <a href="/auth/login">Se connecter</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Créer une mission</h1>
        <p className="text-gray-600">
          Proposez une mission de bénévolat aux utilisateurs de la plateforme.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la mission</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Distribution alimentaire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la mission, ses objectifs et ce que feront les bénévoles..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mission_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de mission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {missionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Présentiel">Présentiel</SelectItem>
                        <SelectItem value="À distance">À distance</SelectItem>
                        <SelectItem value="Hybride">Hybride</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau de difficulté</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="débutant">Débutant</SelectItem>
                        <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engagement_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau d'engagement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un engagement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ultra-rapide">Ultra-rapide</SelectItem>
                        <SelectItem value="Petit coup de main">Petit coup de main</SelectItem>
                        <SelectItem value="Mission avec suivi">Mission avec suivi</SelectItem>
                        <SelectItem value="Projet long">Projet long</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 10 rue de la Solidarité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 75001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 * 2 }).map((_, i) => {
                            const hour = Math.floor(i / 2);
                            const minute = (i % 2) * 30;
                            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                            return (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" min="15" step="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="available_spots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de places disponibles</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desired_impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact souhaité (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez l'impact que vous espérez de cette mission..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                Prévisualiser
              </Button>
              <Button type="submit" className="bg-blue-600 text-white">
                Publier
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Modale de prévisualisation */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prévisualisation de la mission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{formValues.title || 'Titre de la mission'}</h2>
            <p className="text-muted-foreground">{formValues.description || 'Description de la mission...'}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span><b>Date :</b> {formValues.start_date || '-'}</span>
              <span><b>Heure :</b> {formValues.start_time || '-'}</span>
              <span><b>Durée :</b> {formValues.duration_minutes ? `${formValues.duration_minutes} min` : '-'}</span>
              <span><b>Places :</b> {formValues.available_spots || '-'}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span><b>Adresse :</b> {formValues.address || '-'}</span>
              <span><b>Ville :</b> {formValues.location || '-'}</span>
              <span><b>Code postal :</b> {formValues.postal_code || '-'}</span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Retour à l'édition</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateMission;
