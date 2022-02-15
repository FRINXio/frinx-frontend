import { Button, ButtonGroup, Flex, Icon } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  onCommitBtnClick: () => void;
  onDryRunBtnClick: () => void;
  onCalculateDiffBtnClick: () => void;
  onTransactionCloseBtnClick: () => void;
  isCommitLoading: boolean;
  isCloseTransactionLoading: boolean;
};

const DeviceConfigActions: VoidFunctionComponent<Props> = ({
  onCommitBtnClick,
  onDryRunBtnClick,
  onCalculateDiffBtnClick,
  onTransactionCloseBtnClick,
  isCommitLoading,
  isCloseTransactionLoading,
}) => {
  return (
    <Flex background="gray.300" paddingX={4} paddingY={2}>
      <ButtonGroup isAttached>
        <Button onClick={onCalculateDiffBtnClick}>Calculate diff</Button>
        <Button
          onClick={onDryRunBtnClick}
          leftIcon={<Icon size={20} as={FeatherIcon} icon="play" />}
          isLoading={isCommitLoading}
        >
          Dry run
        </Button>
      </ButtonGroup>
      <ButtonGroup isAttached marginLeft="auto">
        <Button
          onClick={onTransactionCloseBtnClick}
          colorScheme="red"
          leftIcon={<Icon size={20} as={FeatherIcon} icon="trash-2" />}
          isLoading={isCloseTransactionLoading}
        >
          Discard changes
        </Button>
        <Button
          onClick={onCommitBtnClick}
          isLoading={isCommitLoading}
          colorScheme="blue"
          leftIcon={<Icon size={20} as={FeatherIcon} icon="server" />}
        >
          Commit to network
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

export default DeviceConfigActions;
