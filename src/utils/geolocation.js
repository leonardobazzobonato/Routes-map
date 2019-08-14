import {Platform, PermissionsAndroid} from 'react-native'
import pTimeout from 'p-timeout'

const Geolocation = navigator.geolocation
const timeout = 5000

export async function fetchGeolocation() {
  let finalCoords = {}
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
      if (!granted) {
        throw new Error(
          'Permita o uso de GPS para o aplicativo nas configurações do aparelho.',
        )
      }
    }

    const {coords} = await pTimeout(new Promise((resolve, reject) =>
      Geolocation.getCurrentPosition(resolve, reject, {
        timeout,
        enableHighAccuracy: true,
        maximumAge: 1000 * 60 * 60 * 1,
      }),
    ), timeout)
    finalCoords = coords || {}
  } catch (error) {
    if (error.code === 3) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        )
        if (!granted) {
          throw new Error(
            'Permita o uso de GPS para o aplicativo nas configurações do aparelho.',
          )
        }
      

        const {coords} = await pTimeout(new Promise((resolve, reject) =>
          Geolocation.getCurrentPosition(resolve, reject, {
            timeout: 3000,
            enableHighAccuracy: false,
            maximumAge: 1000 * 60 * 60 * 1,
          }),
        ), timeout)
        finalCoords = coords || {}
      } catch (subError) {
        if (
          typeof subError.code !== 'undefined' &&
          subError.code === subError.PERMISSION_DENIED
        ) {
          throw new Error(
            'Permita o uso de GPS para o aplicativo nas configurações do aparelho.',
          )
        }
        if (
          typeof subError.code !== 'undefined' &&
          subError.code === subError.POSITION_UNAVAILABLE &&
          /\bdisabled\b/i.test(subError.message)
        ) {
          throw new Error('Ative seu GPS nas configurações.')
        }
      }
    }
    if (
      typeof error.code !== 'undefined' &&
      error.code === error.PERMISSION_DENIED
    ) {
      throw new Error(
        'Permita o uso de GPS para o aplicativo nas configurações do aparelho.',
      )
    }
    if (
      typeof error.code !== 'undefined' &&
      error.code === error.POSITION_UNAVAILABLE &&
      /\bdisabled\b/i.test(error.message)
    ) {
      throw new Error('Ative seu GPS nas configurações.')
    }
  }

  return finalCoords
}