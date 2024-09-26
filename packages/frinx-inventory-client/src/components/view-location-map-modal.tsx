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
import { DEFAULT_ICON } from '../helpers/map';

export type ViewLocationModal = {
  title?: string;
  location: { name: string; latitude: number | null; longitude: number | null } | null;
};

type Props = {
  onClose: () => void;
  locationModal: ViewLocationModal;
};

const ViewLocationMapModal: VoidFunctionComponent<Props> = ({ onClose, locationModal }) => {
  const [markerRef, setMarkerRef] = useState<MarkerType | null>(null);

  useEffect(() => {
    markerRef?.openPopup();
  }, [markerRef]);

  return (
    <Modal isOpen onClose={onClose} size="5xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{locationModal.title ?? locationModal.location?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {locationModal.location?.latitude && locationModal.location?.longitude ? (
            <MapContainer
              center={[locationModal.location.latitude, locationModal.location.longitude]}
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
                position={[locationModal.location.latitude, locationModal.location.longitude]}
                icon={DEFAULT_ICON}
              >
                <Popup>
                  <Box mt={2}>
                    <Heading as="h3" fontSize="xs" color="blue.700">
                      {locationModal.title ?? locationModal.location.name}
                    </Heading>
                  </Box>
                  {locationModal.title && (
                    <Box mt={2}>
                      <Heading as="h4" fontSize="xs">
                        Location name
                      </Heading>
                      {locationModal.location.name ?? '-'}
                    </Box>
                  )}
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Latitude
                    </Heading>
                    {locationModal.location.latitude}
                  </Box>
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Longitude
                    </Heading>
                    {locationModal.location.longitude}
                  </Box>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <Box mt={2}>
              <Heading as="h3" fontSize="sm">
                Location name
              </Heading>
              {locationModal.location?.name ?? '-'}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button data-cy="location-map-modal-close" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewLocationMapModal;
