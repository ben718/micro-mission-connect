
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProfileRouter() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      navigate('/auth/login');
      return;
    }
    if (profile.is_association) {
      navigate('/profile/association');
    } else {
      navigate('/profile/benevole');
    }
  }, [profile, loading, navigate]);

  return <div>Chargement du profil...</div>;
} 
