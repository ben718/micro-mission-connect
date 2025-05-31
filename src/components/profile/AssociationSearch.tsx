
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AssociationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: associations, isLoading } = useQuery({
    queryKey: ["associations-search", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("organization_profiles")
        .select(`
          id,
          organization_name,
          logo_url,
          address,
          website_url,
          sectors!sector_id (
            name
          )
        `)
        .order("organization_name");

      if (searchQuery.trim()) {
        query = query.ilike("organization_name", `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Rechercher des associations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une association..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Recherche en cours...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {associations?.map((association) => (
              <Link
                key={association.id}
                to={`/organization/${association.id}`}
                className="block"
              >
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={association.logo_url || ''} />
                    <AvatarFallback>
                      {association.organization_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{association.organization_name}</h4>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {association.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{association.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {association.sectors && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {association.sectors.name}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {association.website_url && (
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
            
            {associations && associations.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {searchQuery ? "Aucune association trouvée" : "Commencez à taper pour rechercher"}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationSearch;
