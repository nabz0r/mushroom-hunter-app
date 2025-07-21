import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  hasPermission: boolean;
  nearbySpots: Array<{
    id: string;
    distance: number;
    bearing: number;
  }>;
  exploredAreas: Array<{
    latitude: number;
    longitude: number;
    radius: number;
    firstVisit: string;
  }>;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  hasPermission: false,
  nearbySpots: [],
  exploredAreas: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.hasPermission = action.payload;
    },
    updateNearbySpots: (state, action: PayloadAction<LocationState['nearbySpots']>) => {
      state.nearbySpots = action.payload;
    },
    addExploredArea: (state, action: PayloadAction<LocationState['exploredAreas'][0]>) => {
      const exists = state.exploredAreas.some(
        area => 
          Math.abs(area.latitude - action.payload.latitude) < 0.001 &&
          Math.abs(area.longitude - action.payload.longitude) < 0.001
      );
      
      if (!exists) {
        state.exploredAreas.push(action.payload);
      }
    },
  },
});

export const {
  setCurrentLocation,
  setTracking,
  setPermission,
  updateNearbySpots,
  addExploredArea,
} = locationSlice.actions;

export default locationSlice.reducer;