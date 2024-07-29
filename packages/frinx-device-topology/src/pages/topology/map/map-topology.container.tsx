import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { gql, useQuery } from 'urql';
import { GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables } from '../../../__generated__/graphql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { defaultMarkerIcon } from '../../../helpers/map-marker-helper';
import { Box, Heading } from '@chakra-ui/react';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM_LEVEL } from '../../../helpers/topology-helpers';
import { LatLngBoundsLiteral } from 'leaflet';

const markerIcon = defaultMarkerIcon();

const GEOMAP_DATA_QUERY = gql`
  query GeoMapDataQuery {
    deviceInventory {
      deviceMetadata {
        nodes {
          id
          deviceName
          locationName
          geolocation {
            latitude
            longitude
          }
        }
      }
    }
  }
`;

// I had to use a wrapping component because the useMap() hook
// can only be used in a descendant of <MapContainer> 
const MapTopologyContainer: VoidFunctionComponent = () => {

  return (
    <MapContainer
      style={{ height: `calc(100vh - 320px)` }}
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM_LEVEL}
      scrollWheelZoom={true}
    >
      <_MapTopologyContainer />
    </MapContainer>
  );
};

// Do not export this component
const _MapTopologyContainer: VoidFunctionComponent = () => {
  // const [center, setCenter] = useState(DEFAULT_MAP_CENTER);
  const map = useMap();

  const [{ data: deviceData, error }] = useQuery<GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables>({
    query: GEOMAP_DATA_QUERY,
  });



  useEffect(() => {
    const bounds: LatLngBoundsLiteral | undefined = deviceData?.deviceInventory.deviceMetadata?.nodes
    ?.filter((node) => node?.geolocation?.latitude && node.geolocation.longitude)
    .map((node) => [node?.geolocation?.latitude!, node?.geolocation?.longitude!]);

    console.log(bounds);

    if (bounds && bounds.length > 0) {
      // setCenter(bounds[0]);
      map.flyToBounds(bounds);
    }
  }, [deviceData]);
  

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deviceData && (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {deviceData.deviceInventory.deviceMetadata?.nodes
            ?.filter((node) => node && node.id && node?.geolocation?.latitude && node.geolocation.longitude)
            .map((node) => {
              return (
                <Marker
                  position={[node?.geolocation?.latitude!, node?.geolocation?.longitude!]}
                  key={node?.id}
                  icon={markerIcon}
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
            })}
        </MarkerClusterGroup>
      )}
    </>
  );
};

export default MapTopologyContainer;
