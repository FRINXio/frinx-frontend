import * as L from 'leaflet';
import React, { VoidFunctionComponent } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { gql, useQuery } from 'urql';
import { GeoMapDataQueryQuery, GeoMapDataQueryQueryVariables } from '../../../__generated__/graphql';

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

  console.log(deviceData);

  return (
      <MapContainer style={{height:600}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          {deviceData && deviceData?.deviceInventory.deviceMetadata?.nodes?.filter((node) => node?.geolocation?.latitude && node.geolocation.longitude).map((node) => {
            return (
              <Marker position={[node?.geolocation?.longitude!, node?.geolocation?.latitude!]} key={node?.id}>
                <Popup>
                  {node?.deviceName}<br /> Easily customizable.
                </Popup>
              </Marker>
            )
          })}
        
      </MapContainer>
  );
};

export default MapTopologyContainer;
