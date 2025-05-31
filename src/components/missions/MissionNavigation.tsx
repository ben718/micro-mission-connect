
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const MissionNavigation = () => {
  const { profile } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <Button variant="ghost" asChild>
          <Link to="/missions">Toutes les missions</Link>
        </Button>
        {profile && !profile.is_organization && (
          <Button variant="ghost" asChild>
            <Link to="/profile">Mes missions</Link>
          </Button>
        )}
      </div>
      {profile?.is_organization && (
        <Button className="bg-bleu hover:bg-bleu-700" asChild>
          <Link to="/missions/new">
            <Plus className="w-4 h-4 mr-2" />
            Proposer une mission
          </Link>
        </Button>
      )}
    </div>
  );
};

export default MissionNavigation;
