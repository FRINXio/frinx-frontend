import React, { useEffect, useRef, VoidFunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { gql, useQuery } from 'urql';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Box, Heading } from '@chakra-ui/react';
import { LatLngBoundsLiteral, LatLngTuple, Marker as LeafletMarker } from 'leaflet';
import { GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables } from '../../../__generated__/graphql';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM_LEVEL } from '../../../helpers/topology-helpers';
import { DEFAULT_ICON } from '../../../helpers/map-marker-helper';
import { useStateContext } from '../../../state.provider';

const GEOMAP_DATA_QUERY = gql`
  query GeoMapDataQuery($filter: FilterDevicesMetadatasInput) {
    deviceInventory {
      deviceMetadata(filter: $filter) {
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

// Do not export this component
const MapTopologyContainerDescendant: VoidFunctionComponent = () => {
  const { state } = useStateContext();
  const { mapTopologyType } = state;
  const markersRef = useRef<{ [key: string]: LeafletMarker | null }>({});

  // const [center, setCenter] = useState(DEFAULT_MAP_CENTER);
  const map = useMap();

  const [{ data: deviceData }] = useQuery<GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables>({
    query: GEOMAP_DATA_QUERY,
    variables: {
      filter: { topologyType: mapTopologyType },
    },
  });

  useEffect(() => {
    const bounds: LatLngBoundsLiteral | undefined = deviceData?.deviceInventory.deviceMetadata?.nodes
      ?.map((node) => [node?.geolocation?.latitude, node?.geolocation?.longitude] as LatLngTuple)
      .filter((tuplet) => tuplet !== undefined);

    if (bounds && bounds.length > 0) {
      map.flyToBounds(bounds);
    }
  }, [deviceData, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {deviceData && (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
          {deviceData.deviceInventory.deviceMetadata?.nodes?.map((node) => {
            if (node?.geolocation?.latitude && node?.geolocation?.longitude) {
              return (
                <Marker
                  position={[node.geolocation.latitude, node.geolocation.longitude]}
                  key={node?.id}
                  icon={DEFAULT_ICON}
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

// I had to use a wrapping component because the useMap() hook
// can only be used in a descendant of <MapContainer>
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
