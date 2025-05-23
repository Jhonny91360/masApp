/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {useLocationStore} from '../../store/location/useLocationStore';

interface Props {
  initialLocation: Location;
  showUserLocation?: boolean;
}
export const Map = ({initialLocation, showUserLocation = true}: Props) => {
  const {
    getLocation,
    lastKnownLocation,
    watchLocation,
    clearWatchLocation,
    userLocationsList,
  } = useLocationStore();

  const mapRef = useRef<MapView>(null);

  const cameraLocation = useRef<Location>(initialLocation);

  const [isFollowingUser, setIsFollowingUser] = useState(true);

  const [isShowingPolyline, setIsShowingPolyline] = useState(true);

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

  useEffect(() => {
    watchLocation();

    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCameraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

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
        }}
        onTouchStart={() => setIsFollowingUser(false)}>
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
        {isShowingPolyline && (
          <Polyline
            coordinates={userLocationsList}
            strokeColor="black"
            strokeWidth={5}
          />
        )}
      </MapView>
      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{right: 20, bottom: 140}}
      />
      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{right: 20, bottom: 80}}
      />
      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{right: 20, bottom: 20}}
      />
    </>
  );
};
