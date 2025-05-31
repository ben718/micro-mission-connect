import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MissionSchema } from "@/types/validation";
import { errorMonitoring } from "@/services/errorMonitoring";
import { useErrorHandler } from "@/hooks/useErrorHandler";

// Sous-schema pour le formulaire
const formSchema = MissionSchema.pick({
  title: true,
  description: true,
  location: true,
  duration_minutes: true,
  available_spots: true,
  format: true,
  difficulty_level: true,
  engagement_level: true,
}).extend({
  start_date: MissionSchema.shape.start_date.transform(val => new Date(val)),
  duration_minutes: MissionSchema.shape.duration_minutes.transform(val => val.toString()),
  available_spots: MissionSchema.shape.available_spots.transform(val => val.toString()),
});

interface EditMissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string;
  onSuccess: () => void;
}

const EditMissionDialog: React.FC<EditMissionDialogProps> = ({
  isOpen,
  onClose,
  missionId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [mission, setMission] = React.useState<any>(null);
  const { handleError } = useErrorHandler();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: new Date(),
      duration_minutes: "",
      location: "",
      format: "onsite" as const,
      difficulty_level: "beginner" as const,
      engagement_level: "medium" as const,
      available_spots: "",
    },
  });

  React.useEffect(() => {
    if (isOpen && missionId) {
      fetchMission();
    }
  }, [isOpen, missionId]);

  const fetchMission = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("id", missionId)
        .single();

      if (error) throw error;

      setMission(data);
      form.reset({
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date),
        duration_minutes: data.duration_minutes?.toString() || "",
        location: data.location,
        format: data.format || "onsite",
        difficulty_level: data.difficulty_level || "beginner",
        engagement_level: data.engagement_level || "medium",
        available_spots: data.available_spots.toString(),
      });
    } catch (error) {
      handleError(error as Error, 'EditMissionDialog.fetchMission', {
        logError: true,
        showToast: true,
        fallbackMessage: "Erreur lors de la récupération de la mission"
      });
    }
  };

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);

      // Validation côté client d'abord
      const validation = formSchema.safeParse(values);
      if (!validation.success) {
        toast.error("Données invalides: " + validation.error.errors[0].message);
        return;
      }

      // Validation côté serveur
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error("Non authentifié");
      }

      const validationResponse = await fetch('/functions/v1/validate-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUser.user.access_token}`
        },
        body: JSON.stringify({
          ...values,
          start_date: values.start_date.toISOString(),
          duration_minutes: parseInt(values.duration_minutes),
          available_spots: parseInt(values.available_spots),
          organization_id: mission.organization_id
        })
      });

      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        throw new Error(errorData.details?.[0] || "Validation échouée");
      }

      // Mise à jour en base
      const { error } = await supabase
        .from("missions")
        .update({
          title: values.title,
          description: values.description,
          start_date: values.start_date.toISOString(),
          duration_minutes: parseInt(values.duration_minutes),
          location: values.location,
          format: values.format,
          difficulty_level: values.difficulty_level,
          engagement_level: values.engagement_level,
          available_spots: parseInt(values.available_spots),
          updated_at: new Date().toISOString(),
        })
        .eq("id", missionId);

      if (error) throw error;

      toast.success("Mission modifiée avec succès");
      onSuccess();
      onClose();
    } catch (error) {
      handleError(error as Error, 'EditMissionDialog.onSubmit', {
        logError: true,
        showToast: true,
        fallbackMessage: "Erreur lors de la modification de la mission"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la mission</DialogTitle>
          <DialogDescription>
            Modifiez les détails de votre mission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la mission" {...field} />
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
                      placeholder="Description détaillée de la mission"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={fr}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lieu</FormLabel>
                      <FormControl>
                        <Input placeholder="Lieu de la mission" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="remote">À distance</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="onsite">Sur place</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau de difficulté</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Input
                      type="number"
                      min="1"
                      placeholder="Nombre de places"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Modification..." : "Modifier la mission"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMissionDialog;
