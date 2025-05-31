
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, BarChart2, MessageSquare } from 'lucide-react';

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
            <Link to="/missions/new">
              <Plus className="w-6 h-6" />
              <span>Créer une mission</span>
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => onTabChange("missions")}
          >
            <BarChart2 className="w-6 h-6" />
            <span>Gérer les missions</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => onTabChange("reviews")}
          >
            <MessageSquare className="w-6 h-6" />
            <span>Voir les avis</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
