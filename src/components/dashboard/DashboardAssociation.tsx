
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Clock, Calendar, MapPin, BarChart2 } from "lucide-react";
import { toast } from 'sonner';

type SimpleProfile = {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
};

type MissionRegistration = {
  id: string;
  status: string;
  user_id: string;
  profile?: SimpleProfile;
};

type SimpleMission = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  location: string;
  status: string;
  duration_minutes?: number;
  registrations?: MissionRegistration[];
};

interface Stats {
  totalBenevoles: number;
  totalHeures: number;
  tauxCompletion: number;
}

const DashboardAssociation = () => {
  const { user, profile } = useAuth();
  const [missions, setMissions] = useState<SimpleMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("missions");
  const [stats, setStats] = useState<Stats>({
    totalBenevoles: 0,
    totalHeures: 0,
    tauxCompletion: 0
  });

  useEffect(() => {
    if (user) {
      fetchAssociationMissions();
      fetchStats();
    }
  }, [user]);

  const fetchAssociationMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch missions for this organization
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select(`
          id, 
          title, 
          description,
          start_date,
          location,
          status,
          duration_minutes
        `)
        .eq("organization_id", user?.id)
        .order("start_date", { ascending: true });
      
      if (missionsError) throw missionsError;
      
      let missionsWithRegistrations: SimpleMission[] = missionsData || [];
      
      // For each mission, fetch its registrations
      for (const mission of missionsWithRegistrations) {
        const { data: registrationsData, error: registrationsError } = await supabase
          .from("mission_registrations")
          .select("id, status, user_id")
          .eq("mission_id", mission.id);
          
        if (registrationsError) {
          console.error("Error fetching registrations:", registrationsError);
          continue;
        }
        
        mission.registrations = registrationsData || [];
        
        // If registrations exist, fetch their profiles
        if (registrationsData && registrationsData.length > 0) {
          const userIds = registrationsData.map(r => r.user_id);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, profile_picture_url")
            .in("id", userIds);
            
          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
            continue;
          }
            
          if (profilesData) {
            const profilesMap: Record<string, SimpleProfile> = {};
            profilesData.forEach(profile => {
              profilesMap[profile.id] = {
                id: profile.id,
                first_name: profile.first_name,
                last_name: profile.last_name,
                profile_picture_url: profile.profile_picture_url
              };
            });
            
            mission.registrations = mission.registrations.map(r => ({
              ...r,
              profile: profilesMap[r.user_id]
            }));
          }
        }
      }
      
      setMissions(missionsWithRegistrations);
    } catch (err: any) {
      console.error("Error loading missions:", err);
      setError(err.message || "An error occurred while loading missions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (!user) {
        console.error("No user connected to fetch stats");
        return;
      }

      // Count unique volunteers
      const { data: registrations, error: registrationsError } = await supabase
        .from("mission_registrations")
        .select("user_id");
      
      if (registrationsError) {
        console.error("Error fetching registrations:", registrationsError);
        return;
      }

      const uniqueVolunteers = new Set(registrations?.map(r => r.user_id) || []).size;
      
      // Total hours
      const { data: missionsData, error: missionsError } = await supabase
        .from("missions")
        .select("duration_minutes")
        .eq("organization_id", user.id);

      if (missionsError) {
        console.error("Error fetching missions for stats:", missionsError);
        return;
      }

      const totalMinutes = missionsData?.reduce((acc, m) => acc + (m.duration_minutes || 0), 0) || 0;
      const totalHours = Math.round(totalMinutes / 60);
      
      // Completion rate
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === "completed").length;
      const completionRate = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
      
      setStats({ totalBenevoles: uniqueVolunteers, totalHeures: totalHours, tauxCompletion: completionRate });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{String(status)}</Badge>;
    }
  };

  const handleApplication = async (registrationId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await supabase
        .from('mission_registrations')
        .update({ status })
        .eq('id', registrationId);
      fetchAssociationMissions();
      toast.success(status === 'confirmed' ? 'Application accepted' : 'Application rejected');
    } catch (error) {
      console.error("Error processing application:", error);
      toast.error("An error occurred while processing the application");
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button asChild>
              <Link to="/missions">View all missions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDate = new Date();
  const upcomingMissions = missions.filter((m) => new Date(m.start_date) >= currentDate && m.status === 'active');
  const pastMissions = missions.filter((m) => new Date(m.start_date) < currentDate || m.status !== 'active');

  return (
    <div className="container-custom py-10">
      {/* Association header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.profile_picture_url || ""} />
            <AvatarFallback className="text-2xl">
              {profile?.first_name?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1 text-bleu">{profile?.first_name} {profile?.last_name}</h1>
            <p className="text-gray-600">Welcome to your association dashboard!</p>
            {profile?.city && (
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1 text-bleu" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>
        </div>
        <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3 shadow-sm">
          <Link to="/missions/new">
            <Plus className="w-5 h-5 mr-2" />
            Create Mission
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Created Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{missions.length}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Volunteers Engaged</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalBenevoles}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Volunteer Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.totalHeures}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-gray-200 border-opacity-60 bg-white p-6">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{stats.tauxCompletion}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Missions */}
      <Card className="border border-gray-200 border-opacity-60 bg-white p-6">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b rounded-none">
              <TabsTrigger value="missions" className="flex-1">Upcoming Missions ({upcomingMissions.length})</TabsTrigger>
              <TabsTrigger value="past-missions" className="flex-1">Past Missions ({pastMissions.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Missions</h2>
              {upcomingMissions.length === 0 ? (
                <p className="text-gray-500">No upcoming missions.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{mission.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.registrations?.length || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="past-missions" className="p-6">
              <h2 className="text-xl font-bold mb-4">Past Missions</h2>
              {pastMissions.length === 0 ? (
                <p className="text-gray-500">No past missions.</p>
              ) : (
                <div className="space-y-4">
                  {pastMissions.map((mission) => (
                    <Card key={mission.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link to={`/missions/${mission.id}`} className="font-medium text-lg text-bleu hover:underline">
                          {mission.title}
                        </Link>
                        <div className="flex items-center text-gray-500 text-sm mt-1 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(mission.start_date)}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{mission.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{mission.registrations?.length || 0}</span>
                          </div>
                          {getStatusBadge(mission.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAssociation;
