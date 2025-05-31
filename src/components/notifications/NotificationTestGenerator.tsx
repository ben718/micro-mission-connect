
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const NotificationTestGenerator = () => {
  const { user } = useAuth();

  const createTestNotifications = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer des notifications");
      return;
    }

    const testNotifications = [
      {
        user_id: user.id,
        title: "Bienvenue sur la plateforme",
        content: "Merci de vous être inscrit ! Découvrez les missions disponibles autour de vous.",
        link_url: "/missions"
      },
      {
        user_id: user.id,
        title: "Nouvelle mission disponible",
        content: "Une mission de jardinage communautaire vient d'être publiée près de chez vous.",
        link_url: "/missions"
      },
      {
        user_id: user.id,
        title: "Rappel de mission",
        content: "N'oubliez pas votre mission de demain à 14h : Aide aux devoirs en bibliothèque.",
        link_url: "/dashboard"
      }
    ];

    try {
      const { error } = await supabase
        .from('notifications')
        .insert(testNotifications);

      if (error) throw error;

      toast.success("Notifications de test créées avec succès !");
    } catch (error) {
      console.error('Erreur lors de la création des notifications:', error);
      toast.error("Erreur lors de la création des notifications");
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6 border-dashed border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-sm text-gray-600">Mode Test</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-3">
          Créez des notifications de test pour voir le système en action.
        </p>
        <Button onClick={createTestNotifications} variant="outline" size="sm">
          Créer des notifications de test
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationTestGenerator;
