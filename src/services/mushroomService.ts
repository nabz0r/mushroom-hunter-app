import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { Mushroom, MushroomSpot } from '@/store/slices/mushroomSlice';
import { MushroomIdentification } from '@/types';

interface IdentifyMushroomData {
  image: string; // Base64 encoded image
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface CreateSpotData {
  mushroomId: string;
  latitude: number;
  longitude: number;
  photos: string[];
  notes: string;
  publicSpot: boolean;
}

export const mushroomService = {
  async getMushrooms(): Promise<Mushroom[]> {
    const response = await api.get<Mushroom[]>(API_ENDPOINTS.MUSHROOMS.LIST);
    return response.data;
  },

  async getMushroomDetails(id: string): Promise<Mushroom> {
    const response = await api.get<Mushroom>(API_ENDPOINTS.MUSHROOMS.DETAILS(id));
    return response.data;
  },

  async identifyMushroom(data: IdentifyMushroomData): Promise<MushroomIdentification> {
    const response = await api.post<MushroomIdentification>(
      API_ENDPOINTS.MUSHROOMS.IDENTIFY,
      data
    );
    return response.data;
  },

  async getNearbySpots(latitude: number, longitude: number, radius: number = 5000): Promise<MushroomSpot[]> {
    const response = await api.get<MushroomSpot[]>(API_ENDPOINTS.SPOTS.NEARBY, {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  async createSpot(data: CreateSpotData): Promise<MushroomSpot> {
    const response = await api.post<MushroomSpot>(API_ENDPOINTS.SPOTS.CREATE, data);
    return response.data;
  },

  async getSpotDetails(id: string): Promise<MushroomSpot> {
    const response = await api.get<MushroomSpot>(API_ENDPOINTS.SPOTS.DETAILS(id));
    return response.data;
  },

  async reportSpot(id: string, reason: string): Promise<void> {
    await api.post(`/spots/${id}/report`, { reason });
  },
};