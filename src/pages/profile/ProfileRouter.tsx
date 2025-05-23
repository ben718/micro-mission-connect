
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";

export default function ProfileRouter() {
  const { profile, loading, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || isLoading) return;
    
    if (!user || !profile) {
      console.log('[ProfileRouter] Aucun profil ou utilisateur trouvé, redirection vers login');
      navigate('/auth/login', { replace: true });
      return;
    }
    
    console.log('[ProfileRouter] Profil trouvé, redirection vers le type approprié');
    
    if (profile.is_association) {
      navigate('/profile/association', { replace: true });
    } else {
      navigate('/profile/benevole', { replace: true });
    }
  }, [profile, loading, isLoading, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 text-bleu animate-spin mb-4" />
      <p>Chargement du profil...</p>
    </div>
  );
}
