import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import ClaimResourceLayout from '../claim-resource-layout';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceAllocIpv4PrefixModal: FC<Props> = ({ poolName, isOpen, onClose, onClaim }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const handleOnClaim = () => {
    onClaim(descriptionRef.current?.value ?? '', {
      desiredSize: Number(inputRef.current?.value),
    });
    onClose();
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <>
        <FormControl isRequired>
          <FormLabel>Desired size (number of allocated addresses)</FormLabel>
          <Input ref={inputRef} defaultValue={254} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input ref={descriptionRef} placeholder="Enter description for allocated resources" />
        </FormControl>
      </>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocIpv4PrefixModal;
