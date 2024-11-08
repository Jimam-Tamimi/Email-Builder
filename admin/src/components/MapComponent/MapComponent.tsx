"use client"

import React, { useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

 
function MapComponent({position, onClick}:any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  })
  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map:any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(position);
    // map.fitBounds(bounds);

    setMap(map)
  }, [])

  const [location, setLocation] = useState({
    lat: 38.9637,
    lng: 35.2433
})
  const onUnmount = React.useCallback(function callback(map:any) {
    setMap(null)
    setLocation(position)
  }, [])



  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={7}
        onLoad={onLoad}
        onClick={e => onClick(e)}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <Marker position={position} />
        <></>
      </GoogleMap>
  ) : <></>
}

export default MapComponent