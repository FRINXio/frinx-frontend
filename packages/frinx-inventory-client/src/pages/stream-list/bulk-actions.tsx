import { Button, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onActivateButtonClick: () => void;
  onDisableButtonClick: () => void;
  onDeleteButtonClick: () => void;
  areButtonsDisabled: boolean;
};

const BulkActions: VoidFunctionComponent<Props> = ({
  onActivateButtonClick,
  onDisableButtonClick,
  onDeleteButtonClick,
  areButtonsDisabled,
}) => {
  return (
    <HStack>
      <Button
        data-cy="activate-stream"
        isDisabled={areButtonsDisabled}
        onClick={onActivateButtonClick}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Activate selected
      </Button>
      <Button
        data-cy="disable-stream"
        isDisabled={areButtonsDisabled}
        onClick={onDisableButtonClick}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Disable selected
      </Button>
      <Button
        data-cy="delete-stream"
        isDisabled={areButtonsDisabled}
        onClick={onDeleteButtonClick}
        variant="outline"
        colorScheme="red"
        size="sm"
      >
        Delete selected
      </Button>
    </HStack>
  );
};

export default BulkActions;
