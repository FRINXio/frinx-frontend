import React, { useEffect, useRef, VoidFunctionComponent, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import { useClient } from 'urql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Box, Button, Heading } from '@chakra-ui/react';
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

type OSMData = {
  placeId: string;
  lat: string;
  lon: string;
  displayName: string;
  type: string;
  importance: number;
  address: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};

const defaultOsmData: OSMData = {
  placeId: '',
  lat: '',
  lon: '',
  displayName: '',
  type: '',
  importance: 0,
  address: {},
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
  const [osmData, setOsmData] = useState<OSMData | null>(null);
  const [showLocationInfo, setShowLocationInfo] = useState<boolean>(false);

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

  const fetchOsmData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from OpenStreetMap');
      }
      const data = await response.json();

      const formattedData: OSMData = {
        placeId: data.place_id,
        lat: data.lat,
        lon: data.lon,
        displayName: data.display_name,
        type: data.type,
        importance: data.importance,
        address: data.address || {},
      };

      if (data.error === 'Unable to geocode') {
        setOsmData({ ...formattedData, displayName: 'No information available for this location.' });
      } else {
        setOsmData(formattedData);
      }
    } catch (error) {
      setOsmData({ ...defaultOsmData, displayName: 'Error fetching location data.' });
    }
  };

  const handleLocationInfoClick = (lat: number, lon: number) => () => {
    setOsmData(null);
    setShowLocationInfo((prev) => !prev);

    if (!showLocationInfo) {
      fetchOsmData(lat, lon);
    }
  };

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
    setShowLocationInfo(false);
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
              const lat = node.geolocation.latitude;
              const lon = node.geolocation.longitude;
              return (
                <Marker
                  position={[lat, lon]}
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
                        Latitude
                      </Heading>
                      {lat}
                    </Box>
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Longitude
                      </Heading>
                      {lon}
                    </Box>
                    <Box mt={2}>
                      <Button colorScheme="blue" size="xs" onClick={handleLocationInfoClick(lat, lon)}>
                        {showLocationInfo ? 'Hide Location Info' : 'Show Location Info'}
                      </Button>
                    </Box>
                    {showLocationInfo && osmData && (
                      <Box mt={2}>
                        <Heading as="h4" fontSize="xs">
                          Location Info
                        </Heading>
                        {osmData.displayName || 'No data available'}
                      </Box>
                    )}
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
