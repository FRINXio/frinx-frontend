import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Box,
  FormErrorMessage,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { debounce } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { LocationData } from '../pages/create-device/create-device-page';

type Props = {
  onAddDeviceLocation: (locationData: LocationData) => void;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

type MapUpdaterProps = {
  position: LatLngExpression;
};

type FormValues = {
  name: string;
  latitude: string;
  longitude: string;
};

const AddLocationSchema = yup.object().shape({
  name: yup.string().required('Location name is required'),
  latitude: yup.number().typeError('Please enter a number').required('Please enter a number from 0 to 90'),
  longitude: yup.number().typeError('Please enter a number').required('Please enter a number from 0 to 90'),
});

const AddDeviceLocationModal: FC<Props> = ({ isOpen, onClose, title, onAddDeviceLocation }) => {
  const cancelRef = useRef<HTMLElement | null>(null);

  const [mapPosition, setMapPosition] = useState<LatLngTuple>([51.505, -0.09]);

  const INITIAL_VALUES = {
    name: '',
    latitude: '',
    longitude: '',
  };

  const { values, handleSubmit, resetForm, handleChange, errors } = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: AddLocationSchema,
    onSubmit: (data) => {
      const locationInput = {
        name: data.name,
        coordinates: {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        },
      };
      onAddDeviceLocation(locationInput);
      onClose();
    },
  });

  const updatePosition = debounce((lat: number, lng: number) => {
    if (lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
      setMapPosition([lat, lng]);
    }
  }, 2000);

  useEffect(() => {
    updatePosition(parseFloat(values.latitude), parseFloat(values.longitude));
  }, [values.latitude, values.longitude, updatePosition]);

  const handleCancel = () => {
    setMapPosition([51.505, -0.09]);
    onClose();
    resetForm();
  };

  const MapUpdater: React.FC<MapUpdaterProps> = ({ position }) => {
    const map = useMap();

    useEffect(() => {
      map.flyTo(position, map.getZoom(), {
        animate: true,
      });
    }, [position, map]);

    return null;
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleCancel} leastDestructiveRef={cancelRef}>
      <AlertDialogOverlay>
        <AlertDialogContent minWidth="fit-content" height="fit-content">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>
            <form onSubmit={handleSubmit}>
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
                      onChange={handleChange}
                      value={values.latitude || ''}
                      placeholder="Enter number"
                    />
                    {errors.latitude && <FormErrorMessage>{errors.latitude}</FormErrorMessage>}
                  </FormControl>
                  <FormControl isInvalid={!!errors.longitude}>
                    <FormLabel>Longitude</FormLabel>
                    <Input
                      name="longitude"
                      onChange={handleChange}
                      value={values.longitude || ''}
                      placeholder="Enter number"
                    />
                    {errors.longitude && <FormErrorMessage>{errors.longitude}</FormErrorMessage>}
                  </FormControl>
                </Stack>
              </Box>
              <MapContainer style={{ height: 540, width: 800 }} center={mapPosition} zoom={20} scrollWheelZoom>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapPosition}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
                <MapUpdater position={mapPosition} />
              </MapContainer>
              <Flex justify="end" my={5}>
                <Button data-cy="device-cancel-delete" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button data-cy="device-confirm-delete" colorScheme="blue" type="submit" marginLeft={4}>
                  Add
                </Button>
              </Flex>
            </form>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddDeviceLocationModal;
