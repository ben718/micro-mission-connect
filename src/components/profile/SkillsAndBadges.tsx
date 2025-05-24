import { useSkills, useBadges } from "@/hooks/useSkills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState } from "react";

export function SkillsAndBadges() {
  const {
    skills,
    userSkills,
    isLoadingSkills,
    isLoadingUserSkills,
    addUserSkill,
    updateUserSkill,
    removeUserSkill,
    isAddingSkill,
    isUpdatingSkill,
    isRemovingSkill
  } = useSkills();

  const {
    badges,
    userBadges,
    isLoadingBadges,
    isLoadingUserBadges
  } = useBadges();

  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleAddSkill = () => {
    if (selectedSkill && selectedLevel) {
      addUserSkill({ skillId: selectedSkill, level: selectedLevel });
      setSelectedSkill("");
      setSelectedLevel("");
    }
  };

  if (isLoadingSkills || isLoadingUserSkills || isLoadingBadges || isLoadingUserBadges) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Compétences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner une compétence" />
                </SelectTrigger>
                <SelectContent>
                  {skills?.map((skill) => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="débutant">Débutant</SelectItem>
                  <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddSkill}
                disabled={!selectedSkill || !selectedLevel || isAddingSkill}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {userSkills?.map((userSkill) => (
                  <div
                    key={userSkill.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{userSkill.skill.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Niveau : {userSkill.level}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={userSkill.level}
                        onValueChange={(level) =>
                          updateUserSkill({
                            skillId: userSkill.skill_id,
                            level
                          })
                        }
                        disabled={isUpdatingSkill}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="débutant">Débutant</SelectItem>
                          <SelectItem value="intermédiaire">Intermédiaire</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUserSkill(userSkill.skill_id)}
                        disabled={isRemovingSkill}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-4">
              {userBadges?.map((userBadge) => (
                <div
                  key={userBadge.id}
                  className="flex flex-col items-center p-4 rounded-lg border"
                >
                  <Award className="h-12 w-12 text-primary mb-2" />
                  <h4 className="font-medium text-center">{userBadge.badge.name}</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    {userBadge.badge.description}
                  </p>
                  <Badge className="mt-2">
                    Obtenu le{" "}
                    {new Date(userBadge.acquisition_date).toLocaleDateString("fr-FR")}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 