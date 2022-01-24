import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import ClaimResourceLayout from '../claim-resource-layout';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceAllocVlanModal: FC<Props> = ({ poolName, isOpen, onClaim, onClose }) => {
  const descriptionInputRef = useRef<HTMLInputElement | null>(null);
  const handleOnClaim = () => {
    onClaim(descriptionInputRef.current?.value ?? '');
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Input ref={descriptionInputRef} placeholder="Enter description of what is this Vlan for" />
      </FormControl>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocVlanModal;
