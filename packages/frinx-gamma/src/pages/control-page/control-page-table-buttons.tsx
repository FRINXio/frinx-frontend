import { HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onCommitBtnClick: () => void;
  onDiscardBtnClick: () => void;
  isCommitLoading: boolean;
  isDiscardLoading: boolean;
};

const ControlPageTableButtons: VoidFunctionComponent<Props> = ({
  onCommitBtnClick,
  onDiscardBtnClick,
  isCommitLoading,
  isDiscardLoading,
}) => {
  return (
    <HStack spacing={2}>
      <Tooltip label="Discard changes">
        <IconButton
          aria-label="Discard changes"
          icon={<Icon as={FeatherIcon} icon="trash" />}
          onClick={onDiscardBtnClick}
          isLoading={isDiscardLoading}
        />
      </Tooltip>
      <Tooltip label="Commit changes">
        <IconButton
          aria-label="Commit changes"
          colorScheme="blue"
          icon={<Icon as={FeatherIcon} icon="git-commit" />}
          onClick={onCommitBtnClick}
          isLoading={isCommitLoading}
        />
      </Tooltip>
    </HStack>
  );
};

export default ControlPageTableButtons;
