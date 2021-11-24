import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { omitBy } from 'lodash';
import React, { FC, useCallback, useState } from 'react';
import PoolPropertiesForm from '../create-pool-page/pool-properties-form';
import { PoolResource } from './pool-detail-page';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (payload: PoolResource) => void;
};

const ClaimResourceModal: FC<Props> = ({ poolName, isOpen, onClose, onClaim }) => {
  const [poolResource, setPoolResource] = useState<PoolResource>({ poolProperties: {}, poolPropertyTypes: {} });
  const handleDeleteProperty = useCallback(
    (key: string) => {
      setPoolResource((prev) => {
        return {
          ...prev,
          poolProperties: omitBy(poolResource.poolProperties, (_, k) => k === key),
        };
      });
      setPoolResource((prev) => {
        return {
          ...prev,
          poolPropertyTypes: omitBy(poolResource.poolPropertyTypes, (_, k) => k === key),
        };
      });
    },
    [setPoolResource, poolResource],
  );

  const handlePoolPropertiesChange = (values: { key: string; type: 'string' | 'int'; value: string }) => {
    setPoolResource((prev) => {
      return {
        poolProperties: { ...prev.poolProperties, [values.key]: values.value },
        poolPropertyTypes: { ...prev.poolPropertyTypes, [values.key]: values.type },
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Claim resource for {poolName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <>
            <Box>
              <Text>Set pool properties</Text>
              <PoolPropertiesForm
                onChange={handlePoolPropertiesChange}
                onDeleteBtnClick={handleDeleteProperty}
                poolProperties={poolResource.poolProperties}
                poolPropertyTypes={poolResource.poolPropertyTypes}
              />
            </Box>
            <Divider marginY={5} orientation="horizontal" color="gray.200" />
          </>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => onClaim(poolResource)}>
            Claim resource
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClaimResourceModal;
