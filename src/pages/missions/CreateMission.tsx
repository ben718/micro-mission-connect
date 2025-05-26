import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const CreateMission = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [missionTypes, setMissionTypes] = useState<any[]>([]);
  const [organizationProfile, setOrganizationProfile] = useState<any>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    address: '',
    start_date: '',
    duration_minutes: 60,
    available_spots: 1,
    format: 'Présentiel',
    difficulty_level: 'débutant',
    engagement_level: 'Petit coup de main',
    desired_impact: '',
    mission_type_id: '',
    status: 'active'
  });

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    try {
      // Récupérer le profil de l'organisation
      const { data: orgProfile, error: orgError } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (orgError) {
        toast.error('Vous devez avoir un profil d\'organisation pour créer une mission');
        navigate('/profile');
        return;
      }

      setOrganizationProfile(orgProfile);

      // Récupérer les compétences
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);

      // Récupérer les types de mission
      const { data: typesData, error: typesError } = await supabase
        .from('mission_types')
        .select('*')
        .order('name');

      if (typesError) throw typesError;
      setMissionTypes(typesData || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizationProfile) {
      toast.error('Profil d\'organisation requis');
      return;
    }

    setLoading(true);

    try {
      // Créer la mission
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .insert([{
          ...formData,
          organization_id: organizationProfile.id,
          start_date: new Date(formData.start_date).toISOString(),
        }])
        .select()
        .single();

      if (missionError) throw missionError;

      // Ajouter les compétences requises
      if (selectedSkills.length > 0) {
        const skillsToInsert = selectedSkills.map(skillId => ({
          mission_id: mission.id,
          skill_id: skillId,
          is_required: true
        }));

        const { error: skillsError } = await supabase
          .from('mission_skills')
          .insert(skillsToInsert);

        if (skillsError) throw skillsError;
      }

      toast.success('Mission créée avec succès !');
      navigate('/dashboard');

    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la mission');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const getSkillName = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    return skill?.name || '';
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Créer une nouvelle mission</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Titre de la mission *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Lieu</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Adresse complète</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Date et heure de début *</label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Durée (minutes) *</label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  min={15}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Places disponibles</label>
                <Input
                  type="number"
                  value={formData.available_spots}
                  onChange={(e) => setFormData({ ...formData, available_spots: parseInt(e.target.value) })}
                  min={1}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Format</label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Présentiel">Présentiel</SelectItem>
                    <SelectItem value="À distance">À distance</SelectItem>
                    <SelectItem value="Hybride">Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Niveau de difficulté</label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="débutant">Débutant</SelectItem>
                    <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Niveau d'engagement</label>
                <Select
                  value={formData.engagement_level}
                  onValueChange={(value) => setFormData({ ...formData, engagement_level: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ultra-rapide">Ultra-rapide</SelectItem>
                    <SelectItem value="Petit coup de main">Petit coup de main</SelectItem>
                    <SelectItem value="Mission avec suivi">Mission avec suivi</SelectItem>
                    <SelectItem value="Projet long">Projet long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 sm:mb-2">Type de mission</label>
                <Select
                  value={formData.mission_type_id}
                  onValueChange={(value) => setFormData({ ...formData, mission_type_id: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {missionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Impact souhaité</label>
              <Textarea
                value={formData.desired_impact}
                onChange={(e) => setFormData({ ...formData, desired_impact: e.target.value })}
                rows={3}
                placeholder="Décrivez l'impact que vous espérez de cette mission..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 sm:mb-2">Compétences requises</label>
              <Select onValueChange={addSkill}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ajouter une compétence" />
                </SelectTrigger>
                <SelectContent>
                  {skills
                    .filter(skill => !selectedSkills.includes(skill.id))
                    .map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skillId) => (
                    <Badge key={skillId} variant="secondary" className="flex items-center gap-1">
                      {getSkillName(skillId)}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(skillId)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Création...' : 'Créer la mission'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMission;
