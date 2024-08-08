import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Marker as MarkerType } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export type DeviceLocation = {
  deviceName?: string;
  location: { name: string; latitude: number | null; longitude: number | null } | null;
};

type Props = {
  onClose: () => void;
  deviceLocation: DeviceLocation;
};

const DeviceMapModal: VoidFunctionComponent<Props> = ({ onClose, deviceLocation }) => {
  const [markerRef, setMarkerRef] = useState<MarkerType | null>(null);

  useEffect(() => {
    markerRef?.openPopup();
  }, [markerRef]);

  return (
    <Modal isOpen onClose={onClose} size="5xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{deviceLocation.deviceName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {deviceLocation.location?.latitude && deviceLocation.location?.longitude ? (
            <MapContainer
              center={[deviceLocation.location?.latitude, deviceLocation.location?.longitude]}
              zoom={13}
              style={{ height: '60vh' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                ref={(el) => {
                  setMarkerRef(el);
                }}
                position={[deviceLocation.location?.latitude, deviceLocation.location?.longitude]}
              >
                <Popup>
                  <Box mt={2}>
                    <Heading as="h3" fontSize="xs" color="blue.700">
                      {deviceLocation.deviceName ?? deviceLocation.location?.name ?? '-'}
                    </Heading>
                  </Box>
                  {deviceLocation.deviceName && <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Location name
                    </Heading>
                    {deviceLocation.location?.name ?? '-'}
                  </Box>}
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Latitude
                    </Heading>
                    {deviceLocation.location?.latitude}
                  </Box>
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Longitude
                    </Heading>
                    {deviceLocation.location?.longitude}
                  </Box>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <Box mt={2}>
              <Heading as="h3" fontSize="sm">
                Location name
              </Heading>
              {deviceLocation.location?.name ?? '-'}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button data-cy="device-map-modal-close" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeviceMapModal;
