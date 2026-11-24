import { api } from './client';
import dataJSON from '@/mocks/global.json';
import type { 
  DirectoriesStats, 
  DirectoryDetails, 
  DirectorySummary, 
  GlobalStatistics, 
  WebsiteAuditReport, 
  WebsiteRankingDetailed, 
  WebsiteSearchResult
} from '@/types';

const useAPI = import.meta.env.VITE_API_DATA_SOURCE === 'remote';

export interface ObservatoryApiResponse<T> {
  timestamp: string;
  data: T;
}

export const observatoryService = {
  async getGlobalStatistics(): Promise<GlobalStatistics | null> {
    if (!useAPI) {
      return dataJSON as unknown as GlobalStatistics;
    }
    const response = await api.get<ObservatoryApiResponse<GlobalStatistics>>('/observatory');
    const payload = response.data?.data;

    if (!payload) {
      return null;
    }
    return payload;
  },

  async getDirectoriesRank(): Promise<DirectorySummary[]> {
    if (!useAPI) {
      return dataJSON as unknown as DirectorySummary[];
    }
    const response = await api.get<ObservatoryApiResponse<DirectorySummary[]>>('/observatory/directories/ranks');
    const payload = response.data?.data;

    if (!payload) {
      return [];
    }
    return payload;
  },

  async getDirectoriesStatistics(): Promise<DirectoriesStats> {
    if (!useAPI) {
      throw new Error('Local fallback not implemented for directories statistics');
    }
    const { data } = await api.get<ObservatoryApiResponse<DirectoriesStats>>('/observatory/directories');
    return data.data;
  },

  async getDirectoryStatistics(directoryId: number): Promise<DirectoriesStats> {
    if (!useAPI) {
      throw new Error(`Local fallback not implemented for directory statistics ID: ${directoryId}`);
    }
    const { data } = await api.get<ObservatoryApiResponse<DirectoriesStats>>(`/observatory/directories/${directoryId}/statistics`);
    return data.data;
  },

  async getDirectoryWebsites(directoryId: number): Promise<WebsiteRankingDetailed[]> {
    if (!useAPI) {
      throw new Error(`Local fallback not implemented for directory websites ID: ${directoryId}`);
    }
    const { data } = await api.get<ObservatoryApiResponse<WebsiteRankingDetailed[]>>(`/observatory/directories/${directoryId}/websites`);
    return data.data;
  },

  async getWebsiteAuditReport(websiteId: number): Promise<WebsiteAuditReport> {
    if (!useAPI) {
      throw new Error(`Local fallback not implemented for website audit ID: ${websiteId}`);
    }
    const { data } = await api.get<ObservatoryApiResponse<WebsiteAuditReport>>(`/observatory/websites/${websiteId}`);
    return data.data;
  },

  async searchWebsites(query: string,signal:AbortSignal): Promise<WebsiteSearchResult[]> {
    if (!useAPI) {
      throw new Error(`Local fallback not implemented for website search query: ${query}`);
    }
    const { data } = await api.get<ObservatoryApiResponse<WebsiteSearchResult[]>>(`/observatory/websites/search`, {
      params: { query },
      signal,
    });
    return data.data;
  }
};