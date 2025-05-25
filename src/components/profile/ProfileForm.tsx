import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { MapPin } from "lucide-react";

const profileSchema = z.object({
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  last_name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().optional(),
  postal_code: z.string().regex(/^\d{5}$/, "Code postal invalide").optional(),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères").optional(),
  phone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide").optional(),
  bio: z.string().max(500, "La biographie ne doit pas dépasser 500 caractères").optional(),
});

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { profile, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      address: profile?.address || "",
      postal_code: profile?.postal_code || "",
      city: profile?.city || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
    },
  });

  useEffect(() => {
    // Récupérer les coordonnées à partir de l'adresse
    const getCoordinates = async () => {
      const address = form.getValues("address");
      const postalCode = form.getValues("postal_code");
      const city = form.getValues("city");

      if (address && postalCode && city) {
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
              `${address}, ${postalCode} ${city}`
            )}&limit=1`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            setCoordinates({ lat, lng });
          }
        } catch (error) {
          console.error("Erreur lors de la géocodification:", error);
        }
      }
    };

    const timeoutId = setTimeout(getCoordinates, 1000);
    return () => clearTimeout(timeoutId);
  }, [form.watch("address"), form.watch("postal_code"), form.watch("city")]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...values,
          latitude: coordinates?.lat,
          longitude: coordinates?.lng,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès");
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} />
                  {coordinates && (
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biographie</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm; 