
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useMissions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  address: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  postal_code: z.string().min(1, "Le code postal est requis"),
  start_date: z.string().min(1, "La date de début est requise"),
  start_time: z.string().min(1, "L'heure de début est requise"),
  duration_minutes: z.coerce.number().min(15, "La durée minimale est de 15 minutes"),
  spots_available: z.coerce.number().min(1, "Au moins une place doit être disponible"),
  skills: z.string().optional(),
  category_ids: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
});

const CreateMission = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      postal_code: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      duration_minutes: 60,
      spots_available: 1,
      skills: "",
      category_ids: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer une mission");
      return;
    }

    if (!profile?.is_association) {
      toast.error("Seules les associations peuvent créer des missions");
      return;
    }

    try {
      // Convertir la date et l'heure en objets Date
      const startDateTime = new Date(`${values.start_date}T${values.start_time}`);
      const endDateTime = addHours(startDateTime, values.duration_minutes / 60);

      // Convertir les compétences en tableau
      const skills = values.skills
        ? values.skills.split(",").map((skill) => skill.trim())
        : [];

      // Insérer la mission
      const { data: mission, error } = await supabase
        .from("missions")
        .insert({
          title: values.title,
          description: values.description,
          address: values.address,
          city: values.city,
          postal_code: values.postal_code,
          starts_at: startDateTime.toISOString(),
          ends_at: endDateTime.toISOString(),
          duration_minutes: values.duration_minutes,
          spots_available: values.spots_available,
          association_id: user.id,
          skills_required: skills,
        })
        .select()
        .single();

      if (error) throw error;

      // Associer les catégories à la mission
      if (mission) {
        const categoryInserts = values.category_ids.map((categoryId) => ({
          mission_id: mission.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from("mission_categories")
          .insert(categoryInserts);

        if (categoryError) throw categoryError;
      }

      toast.success("Mission créée avec succès");
      navigate(`/missions/${mission.id}`);
    } catch (error: any) {
      console.error("Erreur lors de la création de la mission:", error);
      toast.error(error.message || "Une erreur est survenue lors de la création de la mission");
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-10">
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

  if (!profile?.is_association) {
    return (
      <div className="container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Accès réservé aux associations</h2>
          <p className="text-gray-500 mb-4">
            Seules les associations peuvent créer des missions de bénévolat.
          </p>
          <Button asChild>
            <a href="/missions">Voir les missions disponibles</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Créer une mission</h1>
        <p className="text-gray-600">
          Proposez une mission de bénévolat aux utilisateurs de MicroBénévole.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse (optionnelle pour les missions à distance)</FormLabel>
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
                  name="city"
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
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                      <Input type="time" {...field} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="spots_available"
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
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compétences requises (séparées par des virgules)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Communication, Organisation, Créativité"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégories</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className={`inline-flex items-center px-3 py-1.5 border rounded-full cursor-pointer transition-colors ${
                          field.value.includes(category.id)
                            ? "bg-bleu text-white border-bleu"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          value={category.id}
                          checked={field.value.includes(category.id)}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (e.target.checked) {
                              field.onChange([...field.value, value]);
                            } else {
                              field.onChange(
                                field.value.filter((id) => id !== value)
                              );
                            }
                          }}
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-bleu hover:bg-bleu-700 w-full md:w-auto">
              Créer la mission
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateMission;
