import { ChevronDownIcon, ChevronUpIcon, AddIcon } from '@chakra-ui/icons';
import { Box, HStack, Icon, IconButton, Input, InputGroup, InputRightAddon, useDisclosure } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Label } from '../__generated__/graphql';

type LabelOptionsProps = {
  labels: Label[];
  selectedLabels: Label[];
  onAdd: (label: Label) => void;
  onLabelCreate?: (label: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabelOptions: FC<LabelOptionsProps> = ({ labels, onAdd, onLabelCreate, onChange }): JSX.Element => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const labelNameInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Box position="relative">
      <InputGroup>
        <Input
          onClick={onOpen}
          placeholder="Search by label"
          onChange={onChange}
          onBlur={() => {
            if (!onLabelCreate) {
              setTimeout(() => {
                onClose();
              }, 150);
            }
          }}
        />
        {onLabelCreate && (
          <InputRightAddon onClick={onToggle}>
            {!isOpen && <Icon as={ChevronDownIcon} />}
            {isOpen && <Icon as={ChevronUpIcon} />}
          </InputRightAddon>
        )}
      </InputGroup>
      {isOpen && (
        <Box
          bg="white"
          position="absolute"
          w="100%"
          zIndex="dropdown"
          borderBottomRadius={6}
          borderX="1px"
          borderBottom="1px"
          borderBottomColor="gray.100"
          borderColor="gray.100"
          maxHeight="200px"
          overflowY="scroll"
        >
          {labels &&
            labels.map((label) => {
              return (
                <Box
                  _hover={{ bg: 'gray.100' }}
                  key={label.id}
                  onClick={() => {
                    onAdd(label);
                    onClose();
                  }}
                  cursor="pointer"
                  borderBottom="1px"
                  borderBottomColor="gray.100"
                  padding={4}
                >
                  {label.name}
                </Box>
              );
            })}
          {onLabelCreate && (
            <Box bg="white" borderBottomRadius={6}>
              <InputGroup>
                <HStack>
                  <Input ref={labelNameInputRef} placeholder="Create label" />
                  <IconButton
                    aria-label="Create label"
                    icon={<Icon size={20} as={AddIcon} />}
                    onClick={() => {
                      const labelName = labelNameInputRef.current?.value.trim();
                      if (labelName?.length !== 0) onLabelCreate(labelName as string);
                      onClose();
                    }}
                  />
                </HStack>
              </InputGroup>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LabelOptions;
