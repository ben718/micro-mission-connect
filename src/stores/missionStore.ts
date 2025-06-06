
import { create } from 'zustand';

interface Mission {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  location: string;
  date: string;
  association: string;
}

interface MissionState {
  missions: Mission[];
  isLoading: boolean;
  fetchMissions: () => Promise<void>;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  isLoading: false,
  
  fetchMissions: async () => {
    set({ isLoading: true });
    try {
      // Simuler la récupération des missions
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockMissions: Mission[] = [
        {
          id: '1',
          title: 'Distribution alimentaire',
          description: 'Aider à distribuer des repas aux personnes sans-abri',
          duration: 15,
          category: 'Alimentaire',
          location: 'Paris 19ème',
          date: '2025-06-06',
          association: 'Les Restos du Cœur'
        },
        {
          id: '2',
          title: 'Lecture aux seniors',
          description: 'Lire le journal à des personnes âgées',
          duration: 30,
          category: 'Social',
          location: 'Paris 18ème',
          date: '2025-06-06',
          association: 'Secours Populaire'
        }
      ];
      
      set({ missions: mockMissions, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      set({ isLoading: false });
    }
  },
}));
