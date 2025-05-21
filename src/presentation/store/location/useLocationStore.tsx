import {create} from 'zustand';
import {Location} from '../../../infrastructure/interfaces/location';
import {getCurrentLocation} from '../../../actions/location/location';

interface LocationState {
  lastKnownLocation: Location | null;

  getLocation: () => Promise<Location>;
}

export const useLocationStore = create<LocationState>(set => ({
  lastKnownLocation: null,

  getLocation: async () => {
    const location = await getCurrentLocation();
    set({lastKnownLocation: location});
    return location;
  },
}));
