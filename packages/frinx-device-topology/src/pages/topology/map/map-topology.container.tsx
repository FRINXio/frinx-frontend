import React, { VoidFunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { gql, useQuery } from 'urql';
import { GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables } from '../../../__generated__/graphql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { defaultMarkerIcon } from '../../../helpers/map-marker-helper';
import { Box, Heading, Text } from '@chakra-ui/react';

const markerIcon = defaultMarkerIcon();

const GEOMAP_DATA_QUERY = gql`
  query GeoMapDataQuery {
    deviceInventory {
      deviceMetadata {
        nodes {
          id
          deviceName
          geolocation {
            latitude
            longitude
          }
        }
      }
    }
  }
`;

const MapTopologyContainer: VoidFunctionComponent = () => {
  const [{ data: deviceData, error }] = useQuery<GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables>({
    query: GEOMAP_DATA_QUERY,
  });

  return (
    <MapContainer style={{ height: 600 }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deviceData && (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {deviceData.deviceInventory.deviceMetadata?.nodes
            ?.filter((node) => node?.geolocation?.latitude && node.geolocation.longitude)
            .map((node) => {
              return (
                <Marker
                  position={[node?.geolocation?.longitude!, node?.geolocation?.latitude!]}
                  key={node?.id}
                  icon={markerIcon}
                >
                  <Popup>
                    <Box mt={2}>
                      <Heading as="h3" fontSize="xs" color="blue.700">
                        {node?.deviceName}
                      </Heading>
                    </Box>
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Location name
                      </Heading>
                      TODO
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
    </MapContainer>
  );
};

export default MapTopologyContainer;
