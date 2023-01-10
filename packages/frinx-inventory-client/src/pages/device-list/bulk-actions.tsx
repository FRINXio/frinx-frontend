import { Button, HStack } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onInstallButtonClick: () => void;
  onDeleteButtonClick: () => void;
  onWorkflowButtonClick: () => void;
  areButtonsDisabled: boolean;
};

const BulkActions: VoidFunctionComponent<Props> = ({
  onInstallButtonClick,
  onDeleteButtonClick,
  onWorkflowButtonClick,
  areButtonsDisabled,
}) => {
  return (
    <HStack>
      <Button
        data-cy="send-to-workflows"
        isDisabled={areButtonsDisabled}
        variant="outline"
        colorScheme="blue"
        size="sm"
        onClick={onWorkflowButtonClick}
      >
        Send to workflow
      </Button>
      <Button
        data-cy="install-devices"
        isDisabled={areButtonsDisabled}
        onClick={onInstallButtonClick}
        variant="outline"
        colorScheme="blue"
        size="sm"
      >
        Install selected
      </Button>
      <Button
        data-cy="delete-devices"
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
