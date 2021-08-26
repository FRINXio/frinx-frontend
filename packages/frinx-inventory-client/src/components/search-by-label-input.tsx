import { AddIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  InputGroup,
  InputLeftAddon,
  Tag,
  TagCloseButton,
  Input,
  useDisclosure,
  Box,
  HStack,
  Icon,
  IconButton,
  InputRightAddon,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { Label } from '../__generated__/graphql';

type Props = {
  labels: Label[] | undefined;
  selectedLabels: Label[];
  onRemove: (label: Label) => void;
  onAdd: (label: Label) => void;
  onLabelCreate?: (label: string) => void;
};

type SelectedLabelsProps = {
  labels: Label[];
  onRemove: (label: Label) => void;
};

type LabelOptionsProps = {
  labels: Label[] | undefined;
  selectedLabels: Label[];
  onAdd: (label: Label) => void;
  onLabelCreate?: (label: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SelectedLabels: FC<SelectedLabelsProps> = ({ labels, onRemove }): JSX.Element => {
  return (
    <>
      {labels && labels.length > 0 && (
        <InputLeftAddon bg="white">
          {labels.map((item) => {
            return (
              <Tag
                key={item.id}
                size="sm"
                cursor="pointer"
                onClick={() => {
                  onRemove(item);
                }}
              >
                <p>{item.name}</p>
                <TagCloseButton />
              </Tag>
            );
          })}
        </InputLeftAddon>
      )}
    </>
  );
};

const LabelOptions: FC<LabelOptionsProps> = ({ labels, onAdd, onLabelCreate, onChange }): JSX.Element => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const labelNameInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Box position="relative">
      <InputGroup>
        <Input onClick={onOpen} placeholder="Search by status" onChange={onChange} />
        <InputRightAddon onClick={onToggle}>
          {!isOpen && <Icon as={ChevronDownIcon} />}
          {isOpen && <Icon as={ChevronUpIcon} />}
        </InputRightAddon>
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

const SearchByLabelInput: FC<Props> = ({ labels, selectedLabels, onAdd, onRemove, onLabelCreate }) => {
  const [filteredLabels, setFilteredLabels] = React.useState(labels);

  const labelList = labels ?? [];

  const handleOnLabelAdd = (label: Label) => {
    const labelIndex = labelList.indexOf(label);
    setFilteredLabels([...labelList.slice(0, labelIndex), ...labelList.slice(labelIndex + 1)]);
  };

  const handleOnLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredLabels(labelList.filter((l) => l.name.includes(e.target.value)));
  };

  const handleOnAdd = (label: Label): void => {
    handleOnLabelAdd(label);
    onAdd(label);
  };

  const handleOnRemove = (label: Label): void => {
    setFilteredLabels(filteredLabels?.concat(label));
    onRemove(label);
  };

  return (
    <InputGroup>
      <SelectedLabels labels={selectedLabels} onRemove={handleOnRemove} />
      <LabelOptions
        labels={filteredLabels}
        selectedLabels={selectedLabels}
        onAdd={handleOnAdd}
        onLabelCreate={onLabelCreate}
        onChange={handleOnLabelInputChange}
      />
    </InputGroup>
  );
};

export default SearchByLabelInput;
