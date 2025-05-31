
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters, type SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';

export function SearchSection() {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFiltersType) => {
    const searchParams = new URLSearchParams();
    
    if (filters.query) searchParams.set('q', filters.query);
    if (filters.category && filters.category.length > 0) searchParams.set('category', filters.category.join(','));
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.date) searchParams.set('date', filters.date);
    if (filters.remote) searchParams.set('remote', 'true');
    if (filters.skills && filters.skills.length > 0) searchParams.set('skills', filters.skills.join(','));

    navigate(`/missions?${searchParams.toString()}`);
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Trouvez votre mission
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed px-4">
              Des milliers de missions vous attendent. Utilisez les filtres pour trouver celle qui vous correspond.
            </p>
          </div>
          
          <div className="w-full max-w-5xl">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
