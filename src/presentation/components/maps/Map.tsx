/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {useLocationStore} from '../../store/location/useLocationStore';

interface Props {
  initialLocation: Location;
  showUserLocation?: boolean;
}
export const Map = ({initialLocation, showUserLocation = true}: Props) => {
  const {getLocation} = useLocationStore();

  const mapRef = useRef<MapView>(null);

  const cameraLocation = useRef<Location>(initialLocation);

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.animateCamera({
      center: location,
    });
  };

  const moveToCurrentLocation = async () => {
    const location = await getLocation();
    if (!location) {
      return;
    }
    moveCameraToLocation(location);
  };

  // const getLocationAsync = async () => {
  //   await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   );

  //   await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //   );

  //   await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  //   );
  // };

  return (
    <>
      <MapView
        // onMapReady={getLocationAsync}
        ref={mapRef}
        showsUserLocation={true}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{flex: 1}}
        region={{
          //   latitude: 3.5278,
          //   longitude: -76.3167,
          // latitude: 37.78825,
          // longitude: -122.4324,
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {/* <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="My Marker"
          description="My Marker Description"
          draggable
          image={require('../../../assets/marker.png')}
        /> */}
      </MapView>
      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{right: 20, bottom: 20}}
      />
    </>
  );
};
