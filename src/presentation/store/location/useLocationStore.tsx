import {create} from 'zustand';
import {Location} from '../../../infrastructure/interfaces/location';
import {
  clearWatchLocation,
  getCurrentLocation,
  watchCurrentLocation,
} from '../../../actions/location/location';

interface LocationState {
  lastKnownLocation: Location | null;

  userLocationsList: Location[];

  watchId: number | null;

  getLocation: () => Promise<Location>;

  watchLocation: () => void;
  clearWatchLocation: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  lastKnownLocation: null,
  watchId: null,
  userLocationsList: [],
  getLocation: async () => {
    const location = await getCurrentLocation();
    set({lastKnownLocation: location});
    return location;
  },

  watchLocation: () => {
    const watchId = get().watchId;
    if (watchId !== null) {
      get().clearWatchLocation();
    }

    const newWatchId = watchCurrentLocation(location => {
      set({
        lastKnownLocation: location,
        userLocationsList: [...get().userLocationsList, location],
      });
    });
    set({watchId: newWatchId});
  },

  clearWatchLocation: () => {
    const watchId = get().watchId;
    if (watchId !== null) {
      clearWatchLocation(watchId);
    }
  },
}));
