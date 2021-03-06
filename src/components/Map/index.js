import React, { Component, Fragment } from 'react'
import MapView, {Marker} from 'react-native-maps'
import {Platform, PermissionsAndroid, View} from 'react-native'

import Search from '../Search'
import Directions from '../Directions'
import { fetchGeolocation } from '../../utils/geolocation';
import { getPixelSize } from '../../utils'

import markerImage from '../../assets/marker.png'


export default class Map extends Component {
  state = {
    region: null,
    destination: null,
  }

  async componentDidMount() {
    try{
      const {latitude, longitude} = await fetchGeolocation()
  
      this.setState({
        region: { 
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134
        }
      })
    } catch(error) {
      console.error(error)
    }
  }

  handleLocationSelected = (data, { geometry }) => {
    const { location: { lat: latitude, lng: longitude } } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text,
      },
    })
  }

  render() {
    const { region, destination } = this.state
    console.log({destination, region})
  

    return (
      <View style={{ flex: 1 }}>
        <MapView 
        style={{ flex: 1 }} 
        region={region}
        showsUserLocation 
        loadingEnabled 
        ref={el => this.mapView = el}
        >

        { destination && (
          <Fragment>
            <Directions 
              origin={region}
              destination={destination}
              onReady={results => {
                this.mapView.fitToCoordinates(results.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(50),
                  }
                })
              }}
            />
            <Marker coordinate={destination} anchor={{ x:0, y:0 }} image={markerImage}/>
          </Fragment>
        )}
        </MapView>

        <Search onLocationSelected={this.handleLocationSelected} />
      </View>
    )
  }
}
