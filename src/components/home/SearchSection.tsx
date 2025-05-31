
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchFilters, type SearchFilters as SearchFiltersType } from '@/components/search/SearchFilters';

export function SearchSection() {
  const navigate = useNavigate();

  const handleSearch = (filters: SearchFiltersType) => {
    // Construire l'URL avec les filtres
    const searchParams = new URLSearchParams();
    
    if (filters.query) searchParams.set('q', filters.query);
    if (filters.category.length > 0) searchParams.set('category', filters.category.join(','));
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.date) searchParams.set('date', filters.date);
    if (filters.remote) searchParams.set('remote', 'true');
    if (filters.skills.length > 0) searchParams.set('skills', filters.skills.join(','));

    // Naviguer vers la page des missions avec les filtres
    navigate(`/missions?${searchParams.toString()}`);
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter px-4">
              Trouvez votre mission
            </h1>
            <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 px-4">
              Des milliers de missions vous attendent. Utilisez les filtres pour trouver celle qui vous correspond.
            </p>
          </div>
          <div className="w-full max-w-3xl px-4">
            <SearchFilters onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}
