import React, { useEffect, useRef, VoidFunctionComponent, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import { useClient } from 'urql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Box, Heading } from '@chakra-ui/react';
import L, { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM_LEVEL } from '../../../helpers/topology-helpers';
import { DEFAULT_ICON } from '../../../helpers/map-marker-helper';
import { useStateContext } from '../../../state.provider';
import { getDeviceMetadata, getMapDeviceNeighbors, setSelectedMapDeviceName } from '../../../state.actions';

type MarkerLines = {
  id: string;
  from: LatLngTuple;
  to: LatLngTuple;
};

const MapTopologyContainerDescendant: VoidFunctionComponent = () => {
  const client = useClient();
  const { state, dispatch } = useStateContext();
  const {
    mapTopologyType,
    mapTopologyDeviceSearch,
    selectedMapDeviceName,
    devicesMetadata: deviceData,
    mapDeviceNeighbors,
  } = state;

  const map = useMap();
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const [markersReady, setMarkersReady] = useState(false);

  useEffect(() => {
    dispatch(getDeviceMetadata(client, { topologyType: mapTopologyType, deviceName: mapTopologyDeviceSearch }));
  }, [client, dispatch, mapTopologyType, mapTopologyDeviceSearch]);

  useEffect(() => {
    if (mapTopologyType) {
      dispatch(
        getMapDeviceNeighbors(client, {
          deviceName: selectedMapDeviceName || '',
          topologyType: mapTopologyType,
        }),
      );
    }
  }, [client, dispatch, mapTopologyType, selectedMapDeviceName]);

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
      if (!markersReady) {
        setMarkersReady(true);
      }
      if (selectedMapDeviceName && markerRefs.current.size > 0) {
        const marker = markerRefs.current.get(selectedMapDeviceName);
        if (marker) {
          map.setView(marker.getLatLng(), map.getZoom());
          marker.openPopup();
        }
      }
    }
  }, [deviceData, selectedMapDeviceName, map, markersReady]);

  const handleMarkerClick = (deviceName: string) => () => {
    dispatch(setSelectedMapDeviceName(deviceName));
  };

  const selectedDeviceData = (deviceData || []).find((d) => d.deviceName === selectedMapDeviceName);
  const neighborNames = mapDeviceNeighbors?.map((n) => n.deviceName);
  const deviceConnectionLines: MarkerLines[] = (deviceData || [])
    .filter((device) => (neighborNames || []).includes(device.deviceName || ''))
    .map((d) => {
      const fromLatLng = selectedDeviceData?.geolocation;
      const toLatLng = d.geolocation;

      if (fromLatLng && toLatLng) {
        return {
          id: `${selectedMapDeviceName}-${d.deviceName}`,
          from: [fromLatLng.latitude, fromLatLng.longitude],
          to: [toLatLng.latitude, toLatLng.longitude],
        };
      }

      return null;
    })
    .filter((line): line is MarkerLines => line !== null);

  const handlePopupClose = () => () => {
    dispatch(setSelectedMapDeviceName(null));
  };

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(deviceConnectionLines || []).map((line) => (
        <Polyline key={line.id} positions={[line.from, line.to]} color="black" />
      ))}
      {deviceData && (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {deviceData?.map((node) => {
            if (node?.geolocation?.latitude && node?.geolocation?.longitude) {
              return (
                <Marker
                  position={[node.geolocation.latitude, node.geolocation.longitude]}
                  key={node?.id}
                  icon={DEFAULT_ICON}
                  eventHandlers={{
                    click: handleMarkerClick(node.deviceName || ''),
                    popupclose: handlePopupClose(),
                  }}
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
      style={{ height: `calc(100vh - 320px)`, zIndex: 0 }}
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM_LEVEL}
      scrollWheelZoom
    >
      <MapTopologyContainerDescendant />
    </MapContainer>
  );
};

export default MapTopologyContainer;