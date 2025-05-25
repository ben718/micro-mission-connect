import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserMissions, useMissionStats } from "@/hooks/useMissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Star, User, Clock, CheckCircle2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DashboardBenevole = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Use custom hooks for fetching data
  const { data: missions, isLoading: missionsLoading } = useUserMissions(user?.id);
  const { data: stats, isLoading: statsLoading } = useMissionStats(user?.id, false);
  
  useEffect(() => {
    if (!missionsLoading && !statsLoading) {
      setLoading(false);
    }
  }, [missionsLoading, statsLoading]);

  // Separate upcoming and past missions
  const now = new Date();
  const upcomingMissions = missions?.filter(
    (m) => new Date(m.starts_at) >= now && ["registered", "confirmed"].includes(m.participant_status || '')
  ) || [];
  const pastMissions = missions?.filter(
    (m) => new Date(m.starts_at) < now || m.participant_status === "completed"
  ) || [];

  // Statistics
  const totalMissions = missions?.length || 0;
  const pastMissionsCount = pastMissions?.length || 0;
  const upcomingMissionsCount = upcomingMissions?.length || 0;
  const totalHours = stats?.totalHours || 0;

  // Simple badges
  const badges = [];
  if (pastMissionsCount >= 1) badges.push({ label: "New volunteer", icon: <Star className="w-4 h-4 mr-1" /> });
  if (pastMissionsCount >= 5) badges.push({ label: "Engaged", icon: <CheckCircle2 className="w-4 h-4 mr-1" /> });
  if (totalHours >= 20) badges.push({ label: "Super volunteer", icon: <User className="w-4 h-4 mr-1" /> });

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE d MMMM à HH'h'mm", { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800">Registered</Badge>;
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getIcon = (missionType: string | undefined) => {
    return <Calendar className="h-4 w-4 text-bleu" />;
  };

  return (
    <div className="container-custom py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.profile_picture_url || ""} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile?.first_name, profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-1">Hello {profile?.first_name || user?.email}!</h1>
            <p className="text-gray-600">Welcome to your volunteer space</p>
            {(!profile?.first_name || !profile?.last_name) && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link to="/profile">Complete my profile</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button asChild className="bg-bleu hover:bg-bleu-700 text-white text-lg px-6 py-3">
            <Link to="/missions">
              <Search className="w-5 h-5 mr-2" />
              Find a mission
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Calendar className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Upcoming missions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{upcomingMissionsCount}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle2 className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Completed missions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">
              {missions?.filter(m => m.participant_status === "completed").length || 0}
            </span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Clock className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Volunteer hours</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-bleu">{Math.round(totalHours)}</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-bleu/20">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Star className="w-6 h-6 text-bleu" />
            <CardTitle className="text-base font-semibold text-gray-500">Badges</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {badges.length === 0 ? (
              <span className="text-gray-400">No badges</span>
            ) : (
              badges.map((b, i) => (
                <Badge key={i} className="flex items-center gap-1 bg-bleu/10 text-bleu font-medium">
                  {b.icon}
                  {b.label}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mission tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming missions ({upcomingMissionsCount})</TabsTrigger>
          <TabsTrigger value="past">History ({pastMissionsCount})</TabsTrigger>
        </TabsList>

        {/* Upcoming missions */}
        <TabsContent value="upcoming">
          {loading ? (
            <p>Loading…</p>
          ) : upcomingMissionsCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You have no upcoming missions.</p>
              <Button asChild>
                <Link to="/missions">Find a mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingMissions.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-bleu/10 flex items-center justify-center mr-2">
                            {getIcon(m.category)}
                          </div>
                          <Link to={`/missions/${m.id}`} className="font-medium text-lg text-bleu hover:underline">
                            {m.title}
                          </Link>
                        </div>
                        <div className="flex flex-col space-y-1.5 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(m.starts_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{m.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Duration: {m.duration}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{m.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={m.association?.avatar_url || ""} />
                              <AvatarFallback className="text-xs">
                                {m.association?.first_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              By {m.association?.first_name}
                            </span>
                          </div>
                          {getStatusBadge(m.participant_status || 'registered')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Mission history */}
        <TabsContent value="past">
          {loading ? (
            <p>Loading…</p>
          ) : pastMissionsCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't completed any missions yet.</p>
              <Button asChild>
                <Link to="/missions">Find a mission</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastMissions.map((m) => (
                <Card key={m.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-bleu/10 flex items-center justify-center mr-2">
                            {getIcon(m.category)}
                          </div>
                          <Link to={`/missions/${m.id}`} className="font-medium text-lg text-bleu hover:underline">
                            {m.title}
                          </Link>
                        </div>
                        <div className="flex flex-col space-y-1.5 text-gray-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(m.starts_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{m.city}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Duration: {m.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={m.association?.avatar_url || ""} />
                              <AvatarFallback className="text-xs">
                                {m.association?.first_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">
                              By {m.association?.first_name}
                            </span>
                          </div>
                          {getStatusBadge(m.participant_status || 'completed')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBenevole;
