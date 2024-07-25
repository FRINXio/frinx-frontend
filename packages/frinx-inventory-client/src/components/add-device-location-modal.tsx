import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Box,
} from '@chakra-ui/react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import React, { FC, useRef } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirmBtnClick: () => void;
};

const AddDeviceLocationModal: FC<Props> = ({ isOpen, onClose, title, onConfirmBtnClick }) => {
  const cancelRef = useRef<HTMLElement | null>(null);
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent minWidth="fit-content" height="fit-content">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>
            <Box mb={8}>
              <FormControl>
                <FormLabel>Location name</FormLabel>
                <Input placeholder="Location name" />
              </FormControl>
              <Stack direction="row" spacing={4} mt={4}>
                <FormControl>
                  <FormLabel>Longitude</FormLabel>
                  <Input placeholder="Longtitude" />
                </FormControl>
                <FormControl>
                  <FormLabel>Latitude</FormLabel>
                  <Input placeholder="Latitude" />
                </FormControl>
              </Stack>
            </Box>
            <MapContainer
              style={{ height: 540, width: 800 }}
              center={[48.148598, 17.107748]}
              zoom={20}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[48.148598, 17.107748]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button data-cy="device-cancel-delete" onClick={onClose}>
              Cancel
            </Button>
            <Button data-cy="device-confirm-delete" colorScheme="blue" onClick={onConfirmBtnClick} marginLeft={4}>
              Add
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddDeviceLocationModal;
