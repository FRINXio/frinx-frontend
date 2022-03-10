import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef, useState } from 'react';
import ClaimResourceLayout from '../claim-resource-layout';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceAllocIpv6PrefixModal: FC<Props> = ({ poolName, isOpen, onClaim, onClose }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ desiredSize: string | null; description: string | null }>({
    desiredSize: null,
    description: null,
  });

  const handleOnClaim = () => {
    if (
      descriptionInputRef.current == null ||
      descriptionInputRef.current.value.length === 0 ||
      inputRef.current == null ||
      inputRef.current.value.length === 0
    ) {
      setErrors({
        ...(descriptionInputRef.current == null || descriptionInputRef.current.value.length === 0
          ? { description: 'Description is required' }
          : { description: null }),
        ...(inputRef.current == null || inputRef.current.value.length === 0
          ? { desiredSize: 'Desired size is required' }
          : { desiredSize: null }),
      });
      return;
    }

    onClaim(descriptionInputRef.current?.value ?? '', {
      desiredSize: Number(inputRef.current?.value),
    });
    onClose();
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <FormControl isRequired isInvalid={errors.desiredSize !== null}>
        <FormLabel>Desired size (number of allocated addresses)</FormLabel>
        <Input ref={inputRef} defaultValue={254} />
        <FormErrorMessage>{errors.desiredSize}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={errors.description !== null}>
        <FormLabel>Description</FormLabel>
        <Input ref={descriptionInputRef} placeholder="Please enter description" />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocIpv6PrefixModal;
