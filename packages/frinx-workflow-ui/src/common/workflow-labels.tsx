import React from 'react';
import { Tag } from '@chakra-ui/react';
import { wfLabelsColor } from '../constants';

type Props = {
  index: number;
  onClick: () => void;
  label: string;
};

function WorkflowLabels({ index, label, onClick }: Props) {
  return (
    <Tag
      size="sm"
      background={wfLabelsColor[index]}
      color="white"
      marginRight={1}
      marginBottom={1}
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
    >
      <p>{label}</p>
    </Tag>
  );
}

export default WorkflowLabels;