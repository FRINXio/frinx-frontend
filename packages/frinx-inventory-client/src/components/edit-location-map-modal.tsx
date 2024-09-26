import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useEffect, useState, VoidFunctionComponent } from 'react';
import { Marker as MarkerType } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Autocomplete } from '@frinx/shared/src';
import { DEFAULT_ICON } from '../helpers/map';
import { LocationData } from '../pages/create-device/create-device-page';
import { UpdateDeviceInput } from '../__generated__/graphql';

export type LocationModal = {
  deviceId: string;
  location: { name: string; latitude: number | null; longitude: number | null } | null;
};

type LocationOption = {
  value: string;
  label: string;
  key: string;
};

type Location = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  onClose: () => void;
  locationModal: LocationModal;
  locationOptions: LocationOption[];
  locationsList: Location[];
  onAddDeviceLocation: (locationData: LocationData) => void;
  onUpdateDeviceLocation: (id: string, updatedDeviceData: UpdateDeviceInput) => void;
};

export type FormValues = {
  id?: string;
  name: string;
  latitude: string;
  longitude: string;
};

const INITIAL_VALUES = { name: '', latitude: '', longitude: '' };

const AddLocationSchema = yup.object().shape({
  name: yup.string().required('Location name is required'),
  latitude: yup.number().typeError('Please enter a number').required('Please enter a number'),
  longitude: yup.number().typeError('Please enter a number').required('Please enter a number'),
});

const LocationMapModal: VoidFunctionComponent<Props> = ({
  onClose,
  locationModal,
  locationOptions,
  locationsList,
  onAddDeviceLocation,
  onUpdateDeviceLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | undefined>(
    locationOptions.find((l) => l.label === locationModal.location?.name),
  );
  const [createNewLocation, setCreateNewLocation] = useState<boolean>(false);
  const [markerRef, setMarkerRef] = useState<MarkerType | null>(null);

  const { values, handleSubmit, handleChange, resetForm, setFieldValue, errors } = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: INITIAL_VALUES,
    validationSchema: AddLocationSchema,
    onSubmit: (data) => {
      const locationInput = {
        name: data.name,
        coordinates: {
          latitude: parseFloat(data.latitude.toString()),
          longitude: parseFloat(data.longitude.toString()),
        },
      };
      const newLocationOption = { value: locationInput.name, label: locationInput.name, key: locationInput.name };

      setSelectedLocation(newLocationOption);
      setCreateNewLocation(false);
      onAddDeviceLocation(locationInput);
      resetForm();
    },
  });

  useEffect(() => {
    markerRef?.openPopup();
  }, [markerRef]);

  const handleLocationChange = (locationName?: string | null) => {
    if (locationName) {
      const location = locationOptions.find((loc) => loc.value === locationName);
      setSelectedLocation(location);
    }
  };

  const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);

    return null;
  };

  const displayLocation = locationsList.find((l) => l.name === selectedLocation?.value);
  const newDeviceLocationId = locationsList.find((l) => selectedLocation?.key === l.name)?.id;

  const latitude = displayLocation?.latitude || parseFloat(values.latitude) || 0;
  const longitude = displayLocation?.longitude || parseFloat(values.longitude) || 0;

  const ClickableMap = () => {
    useMapEvents({
      click: (e) => {
        if (createNewLocation) {
          setFieldValue('latitude', e.latlng.lat.toString());
          setFieldValue('longitude', e.latlng.lng.toString());
          setSelectedLocation(undefined); // Clear selected location when manually setting coordinates
        }
      },
    });

    return null;
  };

  return (
    <Modal isOpen onClose={onClose} size="5xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{displayLocation?.name || 'No location selected'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel>Change device location</FormLabel>
          <Flex zIndex={9} mb={4} gap={2}>
            <Autocomplete
              items={locationOptions.map((option) => ({
                ...option,
                key: option.value,
              }))}
              onChange={(e) => {
                handleLocationChange(e?.value);
                setCreateNewLocation(false);
              }}
              selectedItem={selectedLocation}
            />
            <Button
              w="150px"
              onClick={() => {
                resetForm();
                setCreateNewLocation((prev) => !prev);
              }}
              colorScheme={createNewLocation ? 'red' : 'blue'}
            >
              {createNewLocation ? ' Collapse' : 'Add new location'}
            </Button>
          </Flex>
          {createNewLocation && (
            <form onSubmit={handleSubmit}>
              <Divider my={4} />
              <Box mb={8}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="name">Location name</FormLabel>
                  <Input name="name" onChange={handleChange} value={values.name} placeholder="Enter name" />
                  {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                </FormControl>
                <Stack direction="row" spacing={4} mt={4}>
                  <FormControl isInvalid={!!errors.latitude}>
                    <FormLabel>Latitude</FormLabel>
                    <Input
                      name="latitude"
                      onChange={(e) => {
                        handleChange(e);
                        setSelectedLocation(undefined); // Clear selected location when entering manual coordinates
                      }}
                      value={values.latitude || ''}
                      placeholder="Enter number"
                    />
                    {errors.latitude && <FormErrorMessage>{errors.latitude}</FormErrorMessage>}
                  </FormControl>
                  <FormControl isInvalid={!!errors.longitude}>
                    <FormLabel>Longitude</FormLabel>
                    <Input
                      name="longitude"
                      onChange={(e) => {
                        handleChange(e);
                        setSelectedLocation(undefined); // Clear selected location when entering manual coordinates
                      }}
                      value={values.longitude || ''}
                      placeholder="Enter number"
                    />
                    {errors.longitude && <FormErrorMessage>{errors.longitude}</FormErrorMessage>}
                  </FormControl>
                </Stack>
              </Box>
              <Flex justify="end" my={5}>
                <Button data-cy="device-confirm-delete" colorScheme="blue" type="submit" marginLeft={4}>
                  Add
                </Button>
              </Flex>
            </form>
          )}
          <Box position="relative" zIndex={1}>
            <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '60vh' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                ref={(el) => {
                  setMarkerRef(el);
                }}
                position={[latitude, longitude]}
                icon={DEFAULT_ICON}
              >
                <Popup>
                  <Box mt={2}>
                    <Heading as="h3" fontSize="xs" color="blue.700">
                      {displayLocation?.name || values.name || 'No name provided'}
                    </Heading>
                  </Box>
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Latitude
                    </Heading>
                    {latitude}
                  </Box>
                  <Box mt={2}>
                    <Heading as="h4" fontSize="xs">
                      Longitude
                    </Heading>
                    {longitude}
                  </Box>
                </Popup>
              </Marker>
              <RecenterMap lat={latitude} lng={longitude} />
              {createNewLocation && <ClickableMap />}
            </MapContainer>
          </Box>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              onClickCapture={() => {
                onUpdateDeviceLocation(locationModal.deviceId, { locationId: newDeviceLocationId });
              }}
              colorScheme="blue"
              data-cy="location-map-modal-save"
              onClick={onClose}
            >
              Save device location
            </Button>
            <Button data-cy="location-map-modal-close" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationMapModal;
