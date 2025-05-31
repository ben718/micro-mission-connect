
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OptimizedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showQuickJumper?: boolean;
  className?: string;
}

export function OptimizedPagination({
  currentPage,
  totalPages,
  onPageChange,
  showQuickJumper = false,
  className
}: OptimizedPaginationProps) {
  // Calculer les pages à afficher de manière optimisée
  const visiblePages = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Précédent
      </Button>
      
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2 text-muted-foreground">...</span>
          ) : (
            <Button
              onClick={() => onPageChange(page as number)}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="min-w-[40px]"
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="outline"
        size="sm"
      >
        Suivant
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
