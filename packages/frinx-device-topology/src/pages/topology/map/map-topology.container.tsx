import React, { useEffect, useRef, VoidFunctionComponent, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useClient } from 'urql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Box, Heading } from '@chakra-ui/react';
import { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM_LEVEL } from '../../../helpers/topology-helpers';
import { DEFAULT_ICON } from '../../../helpers/map-marker-helper';
import { useStateContext } from '../../../state.provider';
import { getDeviceMetadata } from '../../../state.actions';

const MapTopologyContainerDescendant: VoidFunctionComponent = () => {
  const client = useClient();
  const { state, dispatch } = useStateContext();
  const { mapTopologyType, mapTopologyDeviceSearch, selectedMapDeviceName, devicesMetadata: deviceData } = state;

  const map = useMap();
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const [markersReady, setMarkersReady] = useState(false);

  useEffect(() => {
    dispatch(getDeviceMetadata(client, { topologyType: mapTopologyType, deviceName: mapTopologyDeviceSearch }));
  }, [client, dispatch, mapTopologyType, mapTopologyDeviceSearch]);

  useEffect(() => {
    const bounds: LatLngBoundsLiteral | undefined = deviceData
      ?.map((node) => [node?.geolocation?.latitude, node?.geolocation?.longitude] as LatLngTuple)
      .filter((tuplet) => tuplet !== undefined);

    if (bounds && bounds.length > 0) {
      map.flyToBounds(bounds);
    }
  }, [deviceData, map]);

  useEffect(() => {
    if (deviceData && markerRefs.current.size === deviceData?.length) {
      setMarkersReady(true);
      if (markersReady && selectedMapDeviceName && markerRefs.current.size > 0) {
        const marker = markerRefs.current.get(selectedMapDeviceName);
        if (marker) {
          map.setView(marker.getLatLng(), map.getZoom());
          marker.openPopup();
        }
      }
    }
  }, [deviceData, selectedMapDeviceName, map, markersReady]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deviceData && (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {deviceData?.map((node) => {
            if (node?.geolocation?.latitude && node?.geolocation?.longitude) {
              return (
                <Marker
                  position={[node.geolocation.latitude, node.geolocation.longitude]}
                  key={node?.id}
                  icon={DEFAULT_ICON}
                  ref={(ref) => {
                    if (ref && node.deviceName) {
                      markerRefs.current.set(node.deviceName, ref);
                    }
                  }}
                >
                  <Popup>
                    <Box mt={2}>
                      <Heading as="h3" fontSize="xs" color="blue.700">
                        {node?.deviceName ?? '-'}
                      </Heading>
                    </Box>
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Location name
                      </Heading>
                      {node?.locationName ?? '-'}
                    </Box>
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Latitude
                      </Heading>
                      {node?.geolocation?.latitude}
                    </Box>
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Longitude
                      </Heading>
                      {node?.geolocation?.longitude}
                    </Box>
                  </Popup>
                </Marker>
              );
            }

            return undefined;
          })}
        </MarkerClusterGroup>
      )}
    </>
  );
};

const MapTopologyContainer: VoidFunctionComponent = () => {
  return (
    <MapContainer
      style={{ height: `calc(100vh - 320px)` }}
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM_LEVEL}
      scrollWheelZoom
    >
      <MapTopologyContainerDescendant />
    </MapContainer>
  );
};

export default MapTopologyContainer;
