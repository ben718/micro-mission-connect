
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Mission {
  id: string;
  title: string;
  description: string;
  format: string;
  difficulty_level: string;
  engagement_level: string;
  desired_impact: string;
  location: string;
  latitude: number;
  longitude: number;
  start_date: string;
  duration_minutes: number;
  available_spots: number;
  organization_id: string;
}

interface MissionFilters {
  query?: string;
  city?: string;
  categoryIds?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  remote?: boolean;
  page?: number;
  pageSize?: number;
}

interface UserMission {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  duration: string;
  city: string;
  participant_status: string;
  association?: {
    first_name: string;
    avatar_url?: string;
  };
  category?: string;
}

export const useMissions = (filters?: MissionFilters) => {
  const [data, setData] = useState<{ data: Mission[]; count: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
          .from("missions")
          .select("*", { count: 'exact' })
          .eq("status", "active")
          .order("start_date", { ascending: true });

        // Apply filters
        if (filters?.query) {
          query = query.ilike("title", `%${filters.query}%`);
        }

        if (filters?.city) {
          query = query.eq("location", filters.city);
        }

        if (filters?.page !== undefined && filters?.pageSize) {
          const from = filters.page * filters.pageSize;
          const to = from + filters.pageSize - 1;
          query = query.range(from, to);
        }

        const { data: missions, error, count } = await query;

        if (error) throw error;

        setData({ data: missions || [], count: count || 0 });
      } catch (err: any) {
        console.error("Error fetching missions:", err);
        setError(err);
        toast.error("Error loading missions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [filters]);

  return { data, isLoading, error };
};

export const useUserMissions = (userId?: string) => {
  const [data, setData] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchUserMissions = async () => {
      try {
        setIsLoading(true);
        const { data: registrations, error } = await supabase
          .from("mission_registrations")
          .select(`
            status,
            missions (
              id,
              title,
              description,
              start_date,
              duration_minutes,
              location
            )
          `)
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const userMissions = registrations?.map((reg: any) => ({
          id: reg.missions.id,
          title: reg.missions.title,
          description: reg.missions.description,
          starts_at: reg.missions.start_date,
          duration: `${reg.missions.duration_minutes} minutes`,
          city: reg.missions.location,
          participant_status: reg.status,
          association: {
            first_name: "Association"
          }
        })) || [];

        setData(userMissions);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserMissions();
  }, [userId]);

  return { data, isLoading, error };
};

export const useMissionStats = (userId?: string, isOrganization?: boolean) => {
  const [data, setData] = useState<{ totalHours: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Simple mock stats for now
        setData({ totalHours: 0 });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId, isOrganization]);

  return { data, isLoading };
};
