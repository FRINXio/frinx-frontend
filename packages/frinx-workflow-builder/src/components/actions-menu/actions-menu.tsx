import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { ClientWorkflow } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import React, { FC, useRef, useState } from 'react';
import CloneWorkflowModal from '../clone-workflow-modal/clone-worflow-modal';

type Props = {
  onShowDefinitionBtnClick: () => void;
  onNewWorkflowBtnClick: () => void;
  onEditWorkflowBtnClick: () => void;
  onSaveWorkflowBtnClick: () => void;
  onFileImport: (file: File) => void;
  onFileExport: () => void;
  onWorkflowDelete: (name: string, version?: number | null) => void;
  onWorkflowClone: (name: string) => void;
  onWorkflowEditorBtnClick: () => void;
  workflows: ClientWorkflow[];
  workflow: ClientWorkflow;
};

const ActionsMenu: FC<Props> = ({
  onShowDefinitionBtnClick,
  onNewWorkflowBtnClick,
  onEditWorkflowBtnClick,
  onSaveWorkflowBtnClick,
  onFileImport,
  onFileExport,
  onWorkflowDelete,
  onWorkflowClone,
  onWorkflowEditorBtnClick,
  workflows,
  workflow,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cancelRef = useRef<HTMLDivElement>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { isOpen: isCloneModalOpen, onClose: handleCloseCloneModal, onOpen: handleOpenCloneModal } = useDisclosure();

  const handleWorkflowClone = (name: string) => {
    onWorkflowClone(name);
  };

  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg">Delete workflow</AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ref={cancelRef}
                onClick={() => {
                  setIsAlertOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => onWorkflowDelete(workflow.name, workflow.version)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CloneWorkflowModal
        onWorkflowClone={handleWorkflowClone}
        isOpen={isCloneModalOpen}
        onClose={handleCloseCloneModal}
        workflows={workflows}
      />

      <input
        type="file"
        style={{ display: 'none' }}
        value=""
        accept=".json"
        ref={inputRef}
        onChange={(event) => {
          event.persist();
          if (event.target.files != null) {
            const [file] = Array.from(event.target.files);
            onFileImport(file);
          }
        }}
      />
      <Menu isLazy>
        <MenuButton as={Button} rightIcon={<Icon as={FeatherIcon} icon="chevron-down" size={20} />}>
          Actions
        </MenuButton>
        <Portal>
          <MenuList zIndex="modal">
            <MenuItem onClick={onSaveWorkflowBtnClick}>
              <Box as="span" fontSize="0.8em" marginRight={3} flexShrink={0} alignSelf="center">
                <Box as={FeatherIcon} size="1em" icon="save" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Save workflow
            </MenuItem>
            <MenuGroup>
              <MenuItem onClick={handleOpenCloneModal}>
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box as={FeatherIcon} size="1em" icon="copy" flexShrink={0} lineHeight={4} verticalAlign="middle" />
                </Box>
                Save as
              </MenuItem>
            </MenuGroup>
            <MenuItem onClick={onShowDefinitionBtnClick}>
              <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                <Box as={FeatherIcon} size="1em" icon="code" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Show definition
            </MenuItem>
            <Divider my={2} />
            <MenuGroup title="Create">
              <MenuItem onClick={onNewWorkflowBtnClick}>
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box as={FeatherIcon} size="1em" icon="plus" flexShrink={0} lineHeight={4} verticalAlign="middle" />
                </Box>
                New workflow
              </MenuItem>
              <MenuItem
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box
                    as={FeatherIcon}
                    size="1em"
                    icon="file-plus"
                    flexShrink={0}
                    lineHeight={4}
                    verticalAlign="middle"
                  />
                </Box>
                Import workflow
              </MenuItem>
              <MenuItem onClick={onFileExport}>
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box
                    as={FeatherIcon}
                    size="1em"
                    icon="download"
                    flexShrink={0}
                    lineHeight={4}
                    verticalAlign="middle"
                  />
                </Box>
                Export workflow
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="Edit">
              <MenuItem onClick={onEditWorkflowBtnClick}>
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box as={FeatherIcon} size="1em" icon="edit" flexShrink={0} lineHeight={4} verticalAlign="middle" />
                </Box>
                Edit workflow
              </MenuItem>
              <MenuItem onClick={onWorkflowEditorBtnClick}>
                <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                  <Box as={FeatherIcon} size="1em" icon="code" flexShrink={0} lineHeight={4} verticalAlign="middle" />
                </Box>
                Workflow editor
              </MenuItem>
            </MenuGroup>
            <Divider my={2} />
            <MenuItem
              color="red.500"
              onClick={() => {
                setIsAlertOpen(true);
              }}
            >
              <Box as="span" fontSize="sm" marginRight={3} flexShrink={0}>
                <Box as={FeatherIcon} size="1em" icon="trash" flexShrink={0} lineHeight={4} verticalAlign="middle" />
              </Box>
              Delete workflow
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </>
  );
};

export default ActionsMenu;
