import { InputLeftAddon, Tag, TagCloseButton } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Label } from '../__generated__/graphql';

type SelectedLabelsProps = {
  labels: Label[];
  onRemove: (label: Label) => void;
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

export default SelectedLabels;
