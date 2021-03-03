// @flow
import React from 'react';
import { Tag } from '@chakra-ui/react';
import { wfLabelsColor } from '../constants';

type Props = {
  index: number,
  search: () => void,
  label: string,
};

const WfLabels = (props: Props) => {
  const color = props.index >= wfLabelsColor.length ? wfLabelsColor[0] : wfLabelsColor[props.index];
  return (
    <Tag
      size="sm"
      background={color}
      color="white"
      cursor="pointer"
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        if (props.search) props.search();
      }}
    >
      <p>{props.label}</p>
    </Tag>
  );
};

export default WfLabels;
