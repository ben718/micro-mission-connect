
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, MapPin, Star, Clock, Award } from 'lucide-react';
import { ProfileCardSkeleton } from '@/components/ui/profile-skeleton';
import { ErrorMessage } from '@/components/ui/error-message';

const PublicVolunteerProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completedMissions: 0,
    totalHours: 0,
    badges: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchReviews();
      fetchStats();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_skills (
            skills (name)
          ),
          user_badges (
            badges (name, image_url)
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      setError('Profil non trouvé');
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_reviews')
        .select(`
          *,
          missions (title),
          organization_profiles (organization_name)
        `)
        .eq('volunteer_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Missions terminées
      const { data: completedMissions, error: missionsError } = await supabase
        .from('mission_registrations')
        .select('mission_id, missions(duration_minutes)')
        .eq('user_id', userId)
        .eq('status', 'terminé');

      if (missionsError) throw missionsError;

      // Badges
      const { data: badges, error: badgesError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      const totalHours = (completedMissions || [])
        .reduce((acc, reg) => acc + (reg.missions?.duration_minutes || 0), 0) / 60;

      setStats({
        completedMissions: completedMissions?.length || 0,
        totalHours: Math.round(totalHours * 10) / 10,
        badges: badges?.length || 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <ProfileCardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8">
        <ErrorMessage message={error || 'Profil non trouvé'} />
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header du profil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={profile.profile_picture_url || `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}`} 
              />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.first_name, profile.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                {profile.first_name} {profile.last_name}
                <Badge variant="secondary">Bénévole</Badge>
              </h1>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {profile.city && (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    {profile.city}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-gray-600 mt-3">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Clock className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.totalHours}</span>
            <span className="text-sm text-gray-500">Heures de bénévolat</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Star className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.completedMissions}</span>
            <span className="text-sm text-gray-500">Missions terminées</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Award className="h-8 w-8 mb-2 text-blue-600" />
            <span className="font-bold text-2xl text-blue-600">{stats.badges}</span>
            <span className="text-sm text-gray-500">Badges obtenus</span>
          </CardContent>
        </Card>
      </div>

      {/* Compétences */}
      {profile.user_skills && profile.user_skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.user_skills.map((userSkill: any, index: number) => (
                <Badge key={index} variant="secondary">
                  {userSkill.skills?.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      {profile.user_badges && profile.user_badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.user_badges.map((userBadge: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <img
                    src={userBadge.badges?.image_url || "/placeholder.svg"}
                    alt={userBadge.badges?.name}
                    className="w-8 h-8"
                  />
                  <span className="text-sm">{userBadge.badges?.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Avis des organisations */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avis des organisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{review.organization_profiles?.organization_name}</div>
                      <div className="text-sm text-gray-500">
                        Mission: {review.missions?.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PublicVolunteerProfile;
