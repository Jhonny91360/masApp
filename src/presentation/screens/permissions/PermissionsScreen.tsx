/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {globalStyles} from '../../../config/theme/styles';
import {usePermissionStore} from '../../store/permissions/usePermissionStore';

export const PermissionsScreen = () => {
  const {locationStatus, requestLocationPermission} = usePermissionStore();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Habilitar ubicación</Text>

      <Pressable
        onPress={requestLocationPermission}
        style={globalStyles.btnPrimary}>
        <Text style={{color: 'white'}}>Habilitar ubicación</Text>
      </Pressable>

      <Text>Estado actual: {locationStatus} </Text>
    </View>
  );
};
