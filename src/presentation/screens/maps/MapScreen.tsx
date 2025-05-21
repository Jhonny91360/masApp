/* eslint-disable react-hooks/exhaustive-deps */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Map} from '../../components/maps/Map';
import {useLocationStore} from '../../store/location/useLocationStore';
import {LoadingScreen} from '../loading/LoadingScreen';

export const MapScreen = () => {
  const {lastKnownLocation, getLocation} = useLocationStore();

  useEffect(() => {
    if (!lastKnownLocation) {
      getLocation();
    }
  }, []);

  if (!lastKnownLocation) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Map initialLocation={lastKnownLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
