import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Star, Plus, CheckCircle2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface UserSkill {
  id: string;
  skill_id: string;
  level: string;
  validation_date: string | null;
  validator_id: string | null;
  skill: Skill;
}

const SkillsManager = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  useEffect(() => {
    fetchSkills();
    fetchUserSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des compétences:", error);
      toast.error("Erreur lors de la récupération des compétences");
    }
  };

  const fetchUserSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_skills")
        .select("*, skill:skills(*)")
        .eq("user_id", user.id);

      if (error) throw error;
      setUserSkills(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des compétences utilisateur:", error);
      toast.error("Erreur lors de la récupération des compétences");
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = async () => {
    if (!user || !selectedSkill || !selectedLevel) return;

    try {
      const { error } = await supabase.from("user_skills").insert({
        user_id: user.id,
        skill_id: selectedSkill,
        level: selectedLevel,
      });

      if (error) throw error;

      toast.success("Compétence ajoutée avec succès");
      fetchUserSkills();
      setSelectedSkill("");
      setSelectedLevel("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la compétence:", error);
      toast.error("Erreur lors de l'ajout de la compétence");
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_skills")
        .delete()
        .eq("user_id", user.id)
        .eq("skill_id", skillId);

      if (error) throw error;

      toast.success("Compétence supprimée avec succès");
      fetchUserSkills();
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence:", error);
      toast.error("Erreur lors de la suppression de la compétence");
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "débutant":
        return "bg-blue-100 text-blue-800";
      case "intermédiaire":
        return "bg-yellow-100 text-yellow-800";
      case "expert":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mes compétences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sélectionner une compétence" />
                </SelectTrigger>
                <SelectContent>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="débutant">Débutant</SelectItem>
                  <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={addSkill} disabled={!selectedSkill || !selectedLevel}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSkills.map((userSkill) => (
                <Card key={userSkill.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{userSkill.skill.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {userSkill.skill.category}
                        </p>
                        <Badge className={`mt-2 ${getLevelColor(userSkill.level)}`}>
                          {userSkill.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {userSkill.validation_date ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Star className="w-5 h-5 text-yellow-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(userSkill.skill_id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManager; 