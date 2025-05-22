import { useState, useEffect } from "react";
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
  BadgeProps,
} from "@/components/ui/badge";
import {
  ChevronDown,
  Check,
  X,
  CalendarIcon,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

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

  const [skillInput, setSkillInput] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  // Sync skillTags with form field value
  useEffect(() => {
    if (form.watch('skills')) {
      setSkillTags(form.watch('skills').split(',').map(s => s.trim()).filter(Boolean));
    } else {
      setSkillTags([]);
    }
  }, [form.watch('skills')]);

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skillTags.includes(trimmedSkill)) {
      const newSkillTags = [...skillTags, trimmedSkill];
      setSkillTags(newSkillTags);
      form.setValue('skills', newSkillTags.join(', '));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkillTags = skillTags.filter(tag => tag !== skill);
    setSkillTags(newSkillTags);
    form.setValue('skills', newSkillTags.join(', '));
  };

  const handleSkillInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill(skillInput);
    }
  };

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

  const formValues = form.watch();

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

      <div className="bg-white rounded-lg shadow-md border border-gray-200 border-opacity-60 p-8 mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la mission</FormLabel>
                  <p className="text-xs text-muted-foreground mt-1">Ex : Distribution alimentaire, Atelier lecture...</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Décrivez précisément la mission et son objectif.</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Lieu précis de la mission (optionnel si à distance).</p>
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
                      <p className="text-xs text-muted-foreground mt-1">Ville où se déroule la mission.</p>
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
                      <p className="text-xs text-muted-foreground mt-1">Code postal du lieu de la mission.</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Date de début de la mission.</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Heure de début de la mission.</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Durée totale en minutes (ex : 120 pour 2h).</p>
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
                    <p className="text-xs text-muted-foreground mt-1">Nombre de bénévoles recherchés.</p>
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
                    <FormLabel>Compétences requises</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <Input
                          placeholder="Ex: Communication, Organisation"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillInputKeyDown}
                        />
                        {/* Affichage des tags */}
                        {skillTags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {skillTags.map(skill => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                                <X
                                  className="ml-1 h-3 w-3 cursor-pointer"
                                  onClick={() => handleRemoveSkill(skill)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Appuyez sur Entrée pour ajouter une compétence.</FormDescription>
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
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {field.value && field.value.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {field.value.map(categoryId => {
                                const category = categories.find(cat => cat.id === categoryId);
                                return category ? (
                                  <Badge key={categoryId} variant="secondary">
                                    {category.name}
                                    <X
                                      className="ml-1 h-3 w-3 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(field.value.filter(id => id !== categoryId));
                                      }}
                                    />
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          ) : (
                            <span>Sélectionner les catégories</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher une catégorie..." />
                          <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                value={category.id}
                                onSelect={(currentValue) => {
                                  const newCategoryIds = field.value.includes(currentValue)
                                    ? field.value.filter((id) => id !== currentValue)
                                    : [...field.value, currentValue];
                                  field.onChange(newCategoryIds);
                                }}
                              >
                                {category.name}
                                <Check
                                  className={
                                    `ml-auto h-4 w-4 ${field.value.includes(category.id) ? "opacity-100" : "opacity-0"}`
                                  }
                                />
                              </CommandItem>
                            ))
                            }
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Sélectionnez les catégories pertinentes pour votre mission.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 mt-8">
              <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                Prévisualiser
              </Button>
              <Button type="submit" className="bg-bleu text-white">
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
            <div className="flex flex-wrap gap-2">
              {formValues.category_ids && formValues.category_ids.length > 0 && (
                <span className="text-sm font-medium">Catégories : {formValues.category_ids.join(', ')}</span>
              )}
              {formValues.skills && (
                <span className="text-sm font-medium">Compétences : {formValues.skills}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span><b>Date :</b> {formValues.start_date || '-'}</span>
              <span><b>Heure :</b> {formValues.start_time || '-'}</span>
              <span><b>Durée :</b> {formValues.duration_minutes ? `${formValues.duration_minutes} min` : '-'}</span>
              <span><b>Places :</b> {formValues.spots_available || '-'}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span><b>Adresse :</b> {formValues.address || '-'}</span>
              <span><b>Ville :</b> {formValues.city || '-'}</span>
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
