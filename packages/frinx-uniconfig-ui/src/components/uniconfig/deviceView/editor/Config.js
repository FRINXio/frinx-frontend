import React, { useEffect, useState } from 'react';
import {
  Heading,
  Button,
  Flex,
  IconButton,
  Stack,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Editor from './Editor';

const Config = ({ currentConfigState, isLoading, updateConfig, refreshConfig, replaceConfigWithOper }) => {
  const [isModified, setIsModified] = useState(false);
  const [currentLocalConfigState, setCurrentLocalConfigState] = useState();
  const [prevConfigState, setPrevConfigState] = useState();
  const [isParsable, setIsParsable] = useState(true);

  useEffect(() => {
    setCurrentLocalConfigState(JSON.stringify(currentConfigState, null, 2));
    setPrevConfigState(JSON.stringify(currentConfigState, null, 2));
  }, [currentConfigState]);

  function updateConfigCurrentState(localConfig) {
    try {
      JSON.parse(localConfig);
      setIsParsable(true);
    } catch (e) {
      setIsParsable(false);
    }
    setIsModified(prevConfigState !== localConfig);
    setCurrentLocalConfigState(localConfig);
  }

  function refresh() {
    setIsModified(false);
    refreshConfig();
  }

  function cancel() {
    setIsModified(false);
    setCurrentLocalConfigState(prevConfigState);
  }

  function saveConfig() {
    const config = JSON.parse(currentLocalConfigState);
    updateConfig(config);
    setIsModified(false);
    setPrevConfigState(currentLocalConfigState);
  }

  return (
    <>
      <Flex justify="space-between" align="center" marginBottom={4}>
        <Heading as="h4" size="md">
          Intended Configuration
        </Heading>
        <Stack direction="row" spacing={2}>
          <Button colorScheme="blue" isLoading={isLoading} onClick={saveConfig}>
            Save
          </Button>
          {isModified ? (
            <Button isLoading={isLoading} onClick={cancel}>
              Cancel
            </Button>
          ) : (
            <ButtonGroup isAttached>
              <Button isLoading={isLoading} onClick={refresh}>
                Refresh
              </Button>
              <Menu>
                <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
                <MenuList>
                  <MenuItem onClick={replaceConfigWithOper}>Replace with Operational</MenuItem>
                </MenuList>
              </Menu>
            </ButtonGroup>
          )}
        </Stack>
      </Flex>
      {!isLoading ? (
        <Editor
          isReadOnly={false}
          isModified={isModified}
          currentState={currentLocalConfigState}
          isParsable={isParsable}
          setCurrentLocalConfigState={updateConfigCurrentState}
        />
      ) : (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
    </>
  );
};

export default Config;
