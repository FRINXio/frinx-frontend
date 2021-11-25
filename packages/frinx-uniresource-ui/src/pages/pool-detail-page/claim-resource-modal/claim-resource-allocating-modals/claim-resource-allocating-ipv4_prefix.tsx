import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import ClaimResourceModal from '../claim-resource-modal';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (userInput: Record<string, number | string>, description?: string) => void;
};

const ClaimResourceAllocIpv4PrefixModal: FC<Props> = ({ poolName, isOpen, onClose, onClaim }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);

  const handleOnClaim = () => {
    onClaim(
      {
        desiredSize: Number(inputRef.current?.value),
      },
      descriptionRef.current?.value,
    );
    onClose();
  };
  return (
    <ClaimResourceModal isOpen={isOpen} onClose={onClose} poolName={poolName} onClaim={handleOnClaim}>
      <>
        <FormControl isRequired>
          <FormLabel>Desired size (number of allocated addresses)</FormLabel>
          <Input ref={inputRef} defaultValue={24} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Input ref={descriptionRef} placeholder="Enter description for allocated resources" />
        </FormControl>
      </>
    </ClaimResourceModal>
  );
};

export default ClaimResourceAllocIpv4PrefixModal;
