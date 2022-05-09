import { HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onCommitBtnClick: () => void;
  isCommitLoading: boolean;
};

const ControlPageTableButtons: VoidFunctionComponent<Props> = ({ onCommitBtnClick, isCommitLoading }) => {
  return (
    <HStack spacing={2}>
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
