import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
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
  const handleOnClaim = () => {
    onClaim(descriptionInputRef.current?.value ?? '', {
      desiredSize: inputRef.current?.value ?? 0,
    });
    onClose();
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <FormControl isRequired>
        <FormLabel>Desired size (number of allocated addresses)</FormLabel>
        <Input ref={inputRef} defaultValue={254} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Description</FormLabel>
        <Input ref={descriptionInputRef} placeholder="Enter description of what is this Ipv6 with prefix pool for" />
      </FormControl>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocIpv6PrefixModal;
