import React, { useEffect, useRef, VoidFunctionComponent, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet';
import { useClient } from 'urql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Box, Button, Card, CardBody, CloseButton, Divider, Heading } from '@chakra-ui/react';
import L, { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM_LEVEL, fetchOsmData, OSMData } from '../../../helpers/topology-helpers';
import { DEFAULT_ICON, RED_DEFAULT_ICON } from '../../../helpers/map-marker-helper';
import { useStateContext } from '../../../state.provider';
import {
  getDeviceMetadata,
  getMapDeviceNeighbors,
  getMplsNodesAndEdges,
  getNodesAndEdges,
  getPtpNodesAndEdges,
  getSynceNodesAndEdges,
  getTopologiesOfDevice,
  setMapTopologyType,
  setSelectedMapDeviceName,
  setSelectedMplsNode,
  setSelectedNode,
  setSelectedPtpNode,
  setSelectedSynceNode,
  setTopologyLayer,
} from '../../../state.actions';

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
    ptpNodes,
    synceNodes,
    mplsNodes,
    nodes,
    topologiesOfDevice,
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
    dispatch(setSelectedMapDeviceName(null));
  }, [dispatch]);

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
    setShowLocationInfo(false);
  }, [deviceData, selectedMapDeviceName, map, markersReady]);

  const handleLocationInfoClick = async (lat: number, lon: number) => {
    setOsmData(null);
    setShowLocationInfo((prev) => !prev);

    if (!showLocationInfo) {
      const fetchedOsmData = await fetchOsmData(lat, lon);
      setOsmData(fetchedOsmData);
    }
  };

  const handleMarkerClick = (deviceName: string) => () => {
    dispatch(getTopologiesOfDevice(client, deviceName));
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

  const getTopologyOfDevice = (topology: string) => {
    if (topology) {
      switch (topology) {
        case 'PHYSICAL_TOPOLOGY': {
          return 'LLDP';
        }
        case 'PTP_TOPOLOGY': {
          return 'PTP';
        }
        case 'MPLS_TOPOLOGY': {
          return 'MPLS';
        }
        case 'ETH_TOPOLOGY': {
          return 'Synchronous Ethernet';
        }
        default:
          break;
      }
    }
    return undefined;
  };

  const handleShowDevice = (topology: string) => {
    const layerOfDevice = getTopologyOfDevice(topology);

    if (layerOfDevice) {
      dispatch(setTopologyLayer(layerOfDevice));
    }
    dispatch(setMapTopologyType(null));
    switch (topology) {
      case 'PHYSICAL_TOPOLOGY': {
        dispatch(getNodesAndEdges(client, []));
        const selectedNode = nodes.find((n) => n.name === selectedMapDeviceName);
        if (selectedNode) {
          dispatch(setSelectedNode(selectedNode));
        }
        return;
      }
      case 'PTP_TOPOLOGY': {
        dispatch(getPtpNodesAndEdges(client));
        const selectedPtpNode = ptpNodes.find((n) => n.name === selectedMapDeviceName);
        if (selectedPtpNode) {
          dispatch(setSelectedPtpNode(selectedPtpNode));
        }
        return;
      }
      case 'MPLS_TOPOLOGY': {
        dispatch(getMplsNodesAndEdges(client));
        const selectedMplsNode = mplsNodes.find((n) => n.name === selectedMapDeviceName);
        if (selectedMplsNode) {
          dispatch(setSelectedMplsNode(selectedMplsNode));
        }

        return;
      }
      case 'ETH_TOPOLOGY': {
        dispatch(getSynceNodesAndEdges(client));
        const selectedSynceNode = synceNodes.find((n) => n.name === selectedMapDeviceName);
        if (selectedSynceNode) {
          dispatch(setSelectedSynceNode(selectedSynceNode));
        }

        break;
      }
      default:
        break;
    }
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
            if (node?.geolocation?.latitude && node?.geolocation?.longitude && node.id !== selectedDeviceData?.id) {
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
                />
              );
            }

            return undefined;
          })}
        </MarkerClusterGroup>
      )}
      {selectedDeviceData && selectedDeviceData.geolocation?.latitude && selectedDeviceData.geolocation?.longitude && (
        <Marker
          position={[selectedDeviceData.geolocation.latitude, selectedDeviceData.geolocation.longitude]}
          key={selectedDeviceData.id}
          icon={RED_DEFAULT_ICON}
          eventHandlers={{
            click: handleMarkerClick(selectedDeviceData.deviceName || ''),
            popupclose: handlePopupClose(),
          }}
        />
      )}
      {selectedDeviceData && (
        <Card zIndex={500} minWidth={150} maxWidth={350} position="absolute" right={2} bottom={6}>
          <CloseButton zIndex={1000} size="md" onClick={handlePopupClose()} />
          <CardBody paddingTop={0} paddingBottom={30}>
            <Box mt={2}>
              <Heading as="h3" fontSize="xs" color="blue.700">
                {selectedDeviceData.deviceName ?? '-'}
              </Heading>
            </Box>
            <Box mt={2}>
              <Heading as="h4" fontSize="xs">
                Location name
              </Heading>
              {selectedDeviceData.locationName ?? '-'}
            </Box>
            <Box mt={2}>
              <Heading as="h4" fontSize="xs">
                Latitude
              </Heading>
              {selectedDeviceData.geolocation?.latitude}
            </Box>
            <Box mt={2}>
              <Heading as="h4" fontSize="xs">
                Longitude
              </Heading>
              {selectedDeviceData.geolocation?.longitude}
            </Box>
            <Divider my={2} />

            <Box>
              <Heading as="h4" fontSize="xs">
                Switch to layer
              </Heading>
              {topologiesOfDevice.map((m) => {
                if (m.topologyId !== 'NETWORK_TOPOLOGY') {
                  return (
                    <Button
                      variant="outline"
                      key={m.deviceId}
                      mt={3}
                      size="sm"
                      onClick={() => {
                        handleShowDevice(m.topologyId);
                      }}
                      colorScheme="blue"
                    >
                      {m.topologyId}
                    </Button>
                  );
                }
                return null;
              })}
            </Box>
            <Divider my={2} />
            <Box mt={2}>
              <Button
                colorScheme="blue"
                size="xs"
                onClick={() =>
                  handleLocationInfoClick(
                    selectedDeviceData.geolocation?.latitude || 0,
                    selectedDeviceData.geolocation?.longitude || 0,
                  )
                }
              >
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
          </CardBody>
        </Card>
      )}
    </>
  );
};

const MapTopologyContainer: VoidFunctionComponent = () => {
  return (
    <MapContainer
      style={{ height: `calc(100vh - 320px)`, zIndex: 0, minHeight: 300 }}
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM_LEVEL}
      scrollWheelZoom
    >
      <MapTopologyContainerDescendant />
    </MapContainer>
  );
};

export default MapTopologyContainer;
