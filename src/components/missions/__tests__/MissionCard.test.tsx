
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { MissionCard } from '../MissionCard';
import type { MissionWithDetails } from '@/types/mission';
import '@testing-library/jest-dom';

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

const mockMission: MissionWithDetails = {
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
  status: 'active',
  organization_id: 'org-id',
  address: 'Test Address',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  desired_impact: 'Test impact',
  end_date: null,
  image_url: null,
  latitude: null,
  longitude: null,
  mission_type_id: null,
  postal_code: null,
  organization: {
    id: 'org-id',
    user_id: 'user-id',
    organization_name: 'Organisation Test',
    description: 'Description test',
    logo_url: null,
    website_url: null,
    address: null,
    latitude: null,
    longitude: null,
    sector_id: null,
    is_verified: false,
    verification_date: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    creation_date: null,
    siret_number: null,
    location: null,
    sector: {
      id: 'sector-id',
      name: 'Secteur Test',
      description: 'Description secteur',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  required_skills: [],
  participants_count: 0,
  mission_type: { id: 'type-id', name: 'Type Test', description: 'Description type', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  geo_location: null
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(BrowserRouter, null, component)
    )
  );
};

describe('MissionCard', () => {
  it('should render mission information correctly', () => {
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    expect(screen.getByText('Mission Test')).toBeInTheDocument();
    expect(screen.getByText('Description de test pour la mission')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('Organisation Test')).toBeInTheDocument();
  });

  it('should display the correct duration format', () => {
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    expect(screen.getByText('2h 0min')).toBeInTheDocument();
  });

  it('should show available spots', () => {
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    expect(screen.getByText('5 place(s) disponible(s)')).toBeInTheDocument();
  });

  it('should display difficulty and engagement levels', () => {
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('should handle mission registration click', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    const detailsButton = screen.getByText('Voir les détails');
    expect(detailsButton).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should format date correctly', () => {
    renderWithProviders(React.createElement(MissionCard, { mission: mockMission }));
    
    // La date devrait être affichée au format français
    expect(screen.getByText(/1 juin 2024/)).toBeInTheDocument();
  });
});
