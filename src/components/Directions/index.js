import React from 'react'
import MapViewDirections from 'react-native-maps-directions'

const Directions = ({ destination, origin, onReady }) => (
  <MapViewDirections 
    destination={destination}
    origin={origin}
    onReady={onReady}
    apikey=''
    strokeWidth={3}
    strokeColor='#333'
  />
)

export default Directions