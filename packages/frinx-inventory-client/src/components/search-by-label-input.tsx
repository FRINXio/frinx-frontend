import { InputGroup, InputLeftAddon, Tag, TagCloseButton, Input, useDisclosure, Box } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Label } from '../__generated__/graphql';

type Props = {
  labels: Label[] | undefined;
  selectedLabels: Label[];
  onRemove: (label: Label) => void;
  onAdd: (label: Label) => void;
};

type SelectedLabelsProps = {
  labels: Label[];
  onRemove: (label: Label) => void;
};

type LabelOptionsProps = {
  labels: Label[];
  selectedLabels: Label[];
  onAdd: (label: Label) => void;
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

const LabelOptions: FC<LabelOptionsProps> = ({ labels, onAdd, selectedLabels }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredLabels, setFilteredLabels] = React.useState(labels);

  const handleOnLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredLabels(labels.filter((l) => l.name.includes(e.target.value) && !selectedLabels.includes(l)));
  };

  return (
    <Box position="relative">
      <Input
        onClick={onOpen}
        placeholder="Search by status"
        onChange={handleOnLabelInputChange}
        onBlur={() => {
          setTimeout(() => {
            onClose();
          }, 150);
        }}
      />
      {isOpen && (
        <Box
          bg="white"
          position="absolute"
          w="100%"
          zIndex="dropdown"
          borderBottomRadius={6}
          borderX="1px"
          borderColor="gray.100"
        >
          <Box>
            {filteredLabels.map((label, index) => {
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
                  borderBottomRadius={index === labels.length - 1 ? 6 : 0}
                  borderBottomColor="gray.100"
                  padding={4}
                >
                  {label.name}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const SearchByLabelInput: FC<Props> = ({ labels, selectedLabels, onAdd, onRemove }): JSX.Element => {
  const handleOnAdd = (label: Label): void => {
    onAdd(label);
  };

  const handleOnRemove = (label: Label): void => {
    onRemove(label);
  };

  return (
    <>
      {labels && (
        <InputGroup>
          <SelectedLabels labels={selectedLabels} onRemove={handleOnRemove} />
          <LabelOptions labels={labels} selectedLabels={selectedLabels} onAdd={handleOnAdd} />
        </InputGroup>
      )}
    </>
  );
};

export default SearchByLabelInput;
