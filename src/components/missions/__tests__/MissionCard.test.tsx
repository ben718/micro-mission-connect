
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { MissionCard } from '../MissionCard';

// Mock des hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    profile: { id: 'test-user-id', first_name: 'Test', last_name: 'User' }
  })
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      insert: () => ({ error: null }),
      select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) })
    })
  }
}));

const mockMission = {
  id: 'test-mission-id',
  title: 'Mission Test',
  description: 'Description de test pour la mission',
  location: 'Paris, France',
  start_date: '2024-06-01T10:00:00Z',
  duration_minutes: 120,
  available_spots: 5,
  format: 'onsite',
  difficulty_level: 'beginner',
  engagement_level: 'medium',
  organization_name: 'Organisation Test',
  logo_url: null,
  image_url: null,
  sector_name: 'Environnement',
  mission_type_name: 'Nettoyage'
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('MissionCard', () => {
  it('should render mission information correctly', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('Mission Test')).toBeInTheDocument();
    expect(screen.getByText('Description de test pour la mission')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('Organisation Test')).toBeInTheDocument();
  });

  it('should display the correct duration format', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('2h 0min')).toBeInTheDocument();
  });

  it('should show available spots', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('5 places')).toBeInTheDocument();
  });

  it('should display difficulty and engagement levels', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('Débutant')).toBeInTheDocument();
    expect(screen.getByText('Moyen')).toBeInTheDocument();
  });

  it('should handle mission registration click', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    const registerButton = screen.getByText('S\'inscrire');
    fireEvent.click(registerButton);
    
    // Vérifier que l'action a été déclenchée
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should display mission type badge', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('Nettoyage')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    renderWithProviders(<MissionCard mission={mockMission} />);
    
    // La date devrait être affichée au format français
    expect(screen.getByText(/1 juin 2024/)).toBeInTheDocument();
  });
});
