
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar } from "lucide-react";

interface BadgeDetailModalProps {
  badge: {
    id: string;
    badge: {
      name: string;
      description: string;
      image_url?: string;
    };
    acquisition_date: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeDetailModal({ badge, isOpen, onClose }: BadgeDetailModalProps) {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {badge.badge.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {badge.badge.image_url ? (
              <img
                src={badge.badge.image_url}
                alt={badge.badge.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{badge.badge.name}</h3>
            <p className="text-muted-foreground">{badge.badge.description}</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Obtenu le {new Date(badge.acquisition_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              Badge débloqué
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
