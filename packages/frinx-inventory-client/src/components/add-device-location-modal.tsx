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
  FormErrorMessage,
} from '@chakra-ui/react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { LocationData, locationDataInitialState } from '../pages/create-device/create-device-page';
import { LatLngExpression, LatLngTuple } from 'leaflet';
import { debounce } from 'lodash';

type Props = {
  onAddDeviceLocation: () => void;
  locationData: LocationData;
  setLocationData: Dispatch<SetStateAction<LocationData>>;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

type MapUpdaterProps = {
  position: LatLngExpression;
};

export interface Coordinates {
  latitude: string;
  longitude: string;
}

const AddDeviceLocationModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  locationData,
  setLocationData,
  onAddDeviceLocation,
}) => {
  const cancelRef = useRef<HTMLElement | null>(null);

  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: '', longitude: '' });
  const [position, setPosition] = useState<LatLngTuple>([51.505, -0.09]);
  const [inputErrors, setInputErrors] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const validateInputs = () => {
    const newErrors = { latitude: '', longitude: '', name: '' };

    if (!coordinates.latitude || isNaN(parseFloat(coordinates.latitude))) {
      newErrors.latitude = 'Please enter a valid number from 0 to 90';
    }
    if (!coordinates.longitude || isNaN(parseFloat(coordinates.longitude))) {
      newErrors.longitude = 'Please enter a valid number from 0 to 90';
    }
    if (!locationData.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }

    setInputErrors(newErrors);

    return !newErrors.name && !newErrors.longitude && !newErrors.latitude;
  };

  const updatePosition = useCallback(
    debounce((lat: string, lng: string) => {
      if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
        setPosition([parseFloat(lat), parseFloat(lng)]);
      }
    }, 2000),
    [],
  );

  useEffect(() => {
    updatePosition(coordinates.latitude, coordinates.longitude);
    setLocationData((prev) => ({
      ...prev,
      coordinates: {
        latitude: parseFloat(coordinates.latitude),
        longitude: parseFloat(coordinates.longitude),
      },
    }));
  }, [coordinates.latitude, coordinates.longitude, updatePosition]);

  const handleCancel = () => {
    setPosition([51.505, -0.09]);
    setCoordinates({ latitude: '', longitude: '' });
    setLocationData(locationDataInitialState);
    setInputErrors({
      name: '',
      latitude: '',
      longitude: '',
    });
    onClose();
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      onAddDeviceLocation();
      setInputErrors({
        name: '',
        latitude: '',
        longitude: '',
      });
      setCoordinates({ latitude: '', longitude: '' });
      setLocationData(locationDataInitialState);
      onClose();
    }
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
            <Box mb={8}>
              <FormControl isInvalid={!!inputErrors.name}>
                <FormLabel htmlFor="name">Location name</FormLabel>
                <Input
                  name="name"
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      name: e.target.value,
                    })
                  }
                  value={locationData.name}
                  placeholder="Enter name"
                />
                {inputErrors.name && <FormErrorMessage>{inputErrors.name}</FormErrorMessage>}
              </FormControl>
              <Stack direction="row" spacing={4} mt={4}>
                <FormControl isInvalid={!!inputErrors.latitude}>
                  <FormLabel>Latitude</FormLabel>
                  <Input
                    onChange={(e) => {
                      setCoordinates((prev) => ({
                        ...prev,
                        latitude: e.target.value,
                      }));
                    }}
                    value={coordinates.latitude}
                    placeholder="Enter number"
                  />
                  {inputErrors.latitude && <FormErrorMessage>{inputErrors.latitude}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!inputErrors.longitude}>
                  <FormLabel>Longitude</FormLabel>
                  <Input
                    onChange={(e) => {
                      setCoordinates((prev) => ({
                        ...prev,
                        longitude: e.target.value,
                      }));
                    }}
                    value={coordinates.longitude}
                    placeholder="Enter number"
                  />
                  {inputErrors.longitude && <FormErrorMessage>{inputErrors.longitude}</FormErrorMessage>}
                </FormControl>
              </Stack>
            </Box>
            <MapContainer style={{ height: 540, width: 800 }} center={position} zoom={20} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <MapUpdater position={position} />
            </MapContainer>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button data-cy="device-cancel-delete" onClick={handleCancel}>
              Cancel
            </Button>
            <Button data-cy="device-confirm-delete" colorScheme="blue" onClick={handleSubmit} marginLeft={4}>
              Add
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AddDeviceLocationModal;
