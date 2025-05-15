import {PropsWithChildren, useEffect} from 'react';
import {AppState} from 'react-native';
import {usePermissionStore} from '../store/permissions/usePermissionStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../navigation/StackNavigator';

export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checkLocationPermission} = usePermissionStore();

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  // Si el permiso esta activo, se navega a la pantalla de mapa
  useEffect(() => {
    if (locationStatus === 'granted') {
      // Para evitar que se vuelva a cargar la pantalla de permisos yendo atrás
      navigation.reset({
        routes: [{name: 'MapScreen'}],
      });
    } else if (locationStatus !== 'undetermined') {
      navigation.reset({
        routes: [{name: 'PermissionsScreen'}],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStatus]);

  useEffect(() => {
    // Al iniciar la app, se verifica el estado de la ubicación
    checkLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const suscriber = AppState.addEventListener('change', state => {
      // Cada vez que la app vuelve a estar activa, se verifica el estado de la ubicación
      if (state === 'active') {
        checkLocationPermission();
      }
    });

    return () => suscriber.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
