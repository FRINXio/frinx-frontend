import React from 'react';
import { Tag } from '@chakra-ui/react';
import { wfLabelsColor } from '../constants';

type Props = {
  index: number;
  onClick: () => void;
  label: string;
};

const WorkflowLabels = (props: Props) => {
  const color = props.index >= wfLabelsColor.length ? wfLabelsColor[0] : wfLabelsColor[props.index];
  return (
    <Tag
      size="sm"
      background={color}
      color="white"
      marginRight={1}
      marginBottom={1}
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <p>{props.label}</p>
    </Tag>
  );
};

export default WorkflowLabels;
