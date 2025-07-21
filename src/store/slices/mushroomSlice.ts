import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Mushroom {
  id: string;
  name: string;
  scientificName: string;
  edible: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  points: number;
  description: string;
  habitat: string[];
  season: string[];
  lookalikes: string[];
  imageUrl: string;
}

export interface MushroomSpot {
  id: string;
  mushroomId: string;
  userId: string;
  latitude: number;
  longitude: number;
  photos: string[];
  notes: string;
  dateFound: string;
  verified: boolean;
  publicSpot: boolean;
}

interface MushroomState {
  mushrooms: Mushroom[];
  spots: MushroomSpot[];
  recentFinds: MushroomSpot[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MushroomState = {
  mushrooms: [],
  spots: [],
  recentFinds: [],
  isLoading: false,
  error: null,
};

const mushroomSlice = createSlice({
  name: 'mushroom',
  initialState,
  reducers: {
    setMushrooms: (state, action: PayloadAction<Mushroom[]>) => {
      state.mushrooms = action.payload;
    },
    setSpots: (state, action: PayloadAction<MushroomSpot[]>) => {
      state.spots = action.payload;
    },
    addSpot: (state, action: PayloadAction<MushroomSpot>) => {
      state.spots.push(action.payload);
      state.recentFinds.unshift(action.payload);
      if (state.recentFinds.length > 10) {
        state.recentFinds.pop();
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMushrooms,
  setSpots,
  addSpot,
  setLoading,
  setError,
} = mushroomSlice.actions;

export default mushroomSlice.reducer;