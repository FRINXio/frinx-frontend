import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';
import ClaimResourceLayout from '../claim-resource-layout';

type Props = {
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (description: string, userInput?: Record<string, number | string>) => void;
};

const ClaimResourceAllocVlanModal: React.FC<Props> = ({ poolName, isOpen, onClaim, onClose }) => {
  const descriptionInputRef = React.useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleOnClaim = () => {
    if (descriptionInputRef.current == null || descriptionInputRef.current.value.length === 0) {
      setError('Description is required');
      return;
    }

    onClaim(descriptionInputRef.current?.value ?? '');
    onClose();
  };
  return (
    <ClaimResourceLayout {...{ poolName, isOpen, onClose, onClaim: handleOnClaim }}>
      <FormControl isRequired isInvalid={error !== null}>
        <FormLabel>Description</FormLabel>
        <Input ref={descriptionInputRef} placeholder="Please enter description" />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </ClaimResourceLayout>
  );
};

export default ClaimResourceAllocVlanModal;
