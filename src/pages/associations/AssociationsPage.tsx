
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFollowedOrganizations } from "@/hooks/useFollowOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Users, Building2 } from "lucide-react";

const AssociationsPage = () => {
  const { user } = useAuth();
  const { data: organizations, isLoading } = useFollowedOrganizations(user?.id);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes associations</h1>
        <p className="text-muted-foreground">
          Les associations que vous suivez pour rester informé de leurs activités
        </p>
      </div>

      {!organizations || organizations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune association suivie</h3>
              <p className="text-muted-foreground mb-4">
                Découvrez des associations et suivez-les pour rester informé de leurs activités
              </p>
              <Link 
                to="/missions" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Découvrir des missions
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {organizations.map((org) => (
            <Link key={org.id} to={`/organization/${org.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={org.logo_url || ''} />
                      <AvatarFallback>
                        <Building2 className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold line-clamp-2">{org.organization_name}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssociationsPage;
