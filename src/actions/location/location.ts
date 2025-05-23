import Geolocation from '@react-native-community/geolocation';
import {Location} from '../../infrastructure/interfaces/location';

export const getCurrentLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      info => {
        resolve({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        console.log("Can't get location", error);
        reject(error);
      },
      {enableHighAccuracy: true},
    );
  });
};

export const watchCurrentLocation = (
  locationCallback: (location: Location) => void,
): number => {
  return Geolocation.watchPosition(
    info =>
      locationCallback({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    error => {
      console.log("Can't get watch location", error);
      throw new Error("Can't get watch position");
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );
};

export const clearWatchLocation = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};
