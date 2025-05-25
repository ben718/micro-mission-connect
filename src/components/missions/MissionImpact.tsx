import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Globe, Target } from "lucide-react";

interface MissionImpactProps {
  impact: string;
  format: string;
  participantsCount: number;
  sector: string;
}

const MissionImpact = ({ impact, format, participantsCount, sector }: MissionImpactProps) => {
  const getImpactIcon = () => {
    switch (sector.toLowerCase()) {
      case "environnement":
        return <Globe className="w-6 h-6 text-green-500" />;
      case "social":
        return <Users className="w-6 h-6 text-blue-500" />;
      case "santé":
        return <Heart className="w-6 h-6 text-red-500" />;
      default:
        return <Target className="w-6 h-6 text-purple-500" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "Présentiel":
        return "bg-blue-100 text-blue-800";
      case "À distance":
        return "bg-green-100 text-green-800";
      case "Hybride":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getImpactIcon()}
          <CardTitle>Impact de la mission</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Impact recherché</h3>
            <p className="text-muted-foreground">{impact}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Format</h3>
              <Badge className={getFormatColor(format)}>{format}</Badge>
            </div>

            <div>
              <h3 className="font-medium mb-2">Participants</h3>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{participantsCount} participant(s)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Secteur d'action</h3>
            <Badge variant="outline">{sector}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionImpact; 