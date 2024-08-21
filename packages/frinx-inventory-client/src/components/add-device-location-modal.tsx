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
import { LatLngTuple } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import React, { FC, useEffect, useRef, useState } from 'react';
import { LocationData } from '../pages/create-device/create-device-page';
import { DEFAULT_ICON } from '../helpers/map';

type Props = {
  onAddDeviceLocation: (locationData: LocationData) => void;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  locationList: {
    id: string;
    latitude: number | null;
    longitude: number | null;
    name: string;
  }[];
  setLocationFieldValue: (field: 'locationId', value: string) => void;
};

type MapUpdaterProps = {
  position: LatLngTuple;
};

export type FormValues = {
  id?: string;
  name: string;
  latitude: string;
  longitude: string;
};

const AddLocationSchema = yup.object().shape({
  name: yup.string().required('Location name is required'),
  latitude: yup.number().typeError('Please enter a number').required('Please enter a number'),
  longitude: yup.number().typeError('Please enter a number').required('Please enter a number'),
});

const AddDeviceLocationModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  onAddDeviceLocation,
  setLocationFieldValue,
  locationList,
}) => {
  const cancelRef = useRef<HTMLElement | null>(null);
  const [shouldFlyTo, setShouldFlyTo] = useState(false);
  const INITIAL_VALUES = { name: '', latitude: '', longitude: '' };

  const [parsedMapPosition, setParsedMapPosition] = useState<LatLngTuple>([0, 0]);

  const { values, handleSubmit, resetForm, handleChange, errors, setFieldValue } = useFormik<FormValues>({
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

      onAddDeviceLocation(locationInput);

      onClose();
    },
  });

  useEffect(() => {
    if (values.latitude && values.longitude) {
      setShouldFlyTo(true);
      setParsedMapPosition([parseFloat(values.latitude), parseFloat(values.longitude)]);
    }
  }, [values]);

  useEffect(() => {
    const locationId = locationList.find((loc) => loc.name === values.name)?.id;
    setLocationFieldValue('locationId', locationId || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAddDeviceLocation]);

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const MapUpdater: React.FC<MapUpdaterProps> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (shouldFlyTo) {
        map.flyTo(position, map.getZoom(), { animate: true });
        setShouldFlyTo(false);
      }
    }, [position, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFieldValue('latitude', lat.toFixed(6));
        setFieldValue('longitude', lng.toFixed(6));
        setShouldFlyTo(false);
      },
      dragstart() {
        setShouldFlyTo(false);
      },
      zoomstart() {
        setShouldFlyTo(false);
      },
    });

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
                      onChange={(e) => {
                        handleChange(e);
                        setShouldFlyTo(true);
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
                        setShouldFlyTo(true);
                      }}
                      value={values.longitude || ''}
                      placeholder="Enter number"
                    />
                    {errors.longitude && <FormErrorMessage>{errors.longitude}</FormErrorMessage>}
                  </FormControl>
                </Stack>
              </Box>
              <MapContainer style={{ height: '60vh', width: 800 }} center={parsedMapPosition} zoom={20} scrollWheelZoom>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={parsedMapPosition} icon={DEFAULT_ICON}>
                  <Popup>Choose location either by clicking on the map or entering coordinates.</Popup>
                </Marker>
                <MapUpdater position={parsedMapPosition} />
                <LocationMarker />
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
