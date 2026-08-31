import { useQuery } from '@tanstack/react-query';
import { observatoryService } from '@/api/observatory.service';
import { WebsiteSearchResult } from '@/types';

export function useWebsiteSearch(searchTerm: string) {
  const cleanTerm = searchTerm.trim().toLowerCase();

  return useQuery<WebsiteSearchResult[]>({
    queryKey: ['observatory', 'search', cleanTerm],
    queryFn: ({ signal }) => observatoryService.searchWebsites(cleanTerm, signal),
    enabled: cleanTerm.length >= 3,
    staleTime: 1000 * 60 * 5,     
    gcTime: 1000 * 60 * 30,          
    refetchOnWindowFocus: false,     
    placeholderData: (prev) => prev, 
  });
}