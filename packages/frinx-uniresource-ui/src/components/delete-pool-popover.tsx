import {
  Popover,
  PopoverTrigger,
  Tooltip,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Box,
} from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  onDelete: () => void;
  canDeletePool: boolean;
};

const DeletePoolPopover: FC<Props> = ({ onDelete, canDeletePool, children }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Box maxWidth="max-content">
          <Tooltip
            label="Firstly you need to delete all allocated resources"
            shouldWrapChildren
            isDisabled={canDeletePool}
          >
            {children}
          </Tooltip>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Are you sure you want to delete this pool?</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody mx="auto">
            <Button colorScheme="red" onClick={onDelete}>
              Yes, delete this resource pool
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DeletePoolPopover;
