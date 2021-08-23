import { InputGroup, InputLeftAddon, Tag, TagCloseButton, Input, useDisclosure, Box } from '@chakra-ui/react';
import React, { ChangeEvent, FC } from 'react';

type Props = {
  labels: string[];
  selectedLabels: string[];
  onRemove: (label: string) => void;
  onAdd: (label: string) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type SelectedLabelsProps = {
  labels: string[];
  onRemove: (label: string) => void;
};

type LabelOptionsProps = {
  labels: string[];
  onAdd: (label: string) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SelectedLabels: FC<SelectedLabelsProps> = ({ labels, onRemove }): JSX.Element => {
  return (
    <>
      {labels && labels.length > 0 && (
        <InputLeftAddon bg="white">
          {labels.map((item) => {
            return (
              <Tag
                key={item}
                size="sm"
                cursor="pointer"
                onClick={() => {
                  onRemove(item);
                }}
              >
                <p>{item}</p>
                <TagCloseButton />
              </Tag>
            );
          })}
        </InputLeftAddon>
      )}
    </>
  );
};

const LabelOptions: FC<LabelOptionsProps> = ({ labels, onAdd, onChange }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <Box position="relative">
      <Input onClick={onOpen} placeholder="Search by status" onBlur={onClose} onChange={handleOnChange} />
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
            {labels.map((label, index) => {
              return (
                <Box
                  _hover={{ bg: 'gray.100' }}
                  key={label}
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
                  {label}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const SearchByLabelInput: FC<Props> = ({ labels, selectedLabels, onAdd, onRemove, onChange }): JSX.Element => {
  const handleOnAdd = (label: string): void => {
    onAdd(label);
  };

  const handleOnRemove = (label: string): void => {
    onRemove(label);
  };

  return (
    <InputGroup>
      <SelectedLabels labels={selectedLabels} onRemove={handleOnRemove} />
      <LabelOptions labels={labels} onAdd={handleOnAdd} onChange={onChange} />
    </InputGroup>
  );
};

export default SearchByLabelInput;
