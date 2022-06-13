import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';
import ClaimResourceLayout from '../claim-resource-layout';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceAllocatingVlanRangeModal: FC<Props> = ({ poolName, isOpen, onClose, onClaim }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ desiredSize: string | null; description: string | null }>({
    desiredSize: null,
    description: null,
  });

  const handleOnClaim = () => {
    if (
      descriptionRef.current == null ||
      descriptionRef.current.value.length === 0 ||
      inputRef.current == null ||
      inputRef.current.value.length === 0
    ) {
      setErrors({
        ...(descriptionRef.current == null || descriptionRef.current.value.length === 0
          ? { description: 'Description is required' }
          : { description: null }),
        ...(inputRef.current == null || inputRef.current.value.length === 0
          ? { desiredSize: 'Desired size is required' }
          : { desiredSize: null }),
      });
      return;
    }
    onClaim(descriptionRef.current?.value ?? '', {
      desiredSize: Number(inputRef.current?.value),
    });
    onClose();
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <>
        <FormControl isRequired isInvalid={errors.desiredSize !== null}>
          <FormLabel>Desired size (of vlans)</FormLabel>
          <Input ref={inputRef} defaultValue={1} />
          <FormErrorMessage>{errors.desiredSize}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description !== null}>
          <FormLabel>Description</FormLabel>
          <Input ref={descriptionRef} placeholder="Enter description for allocated resources" />
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>
      </>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocatingVlanRangeModal;
