import React from 'react';
import { Tag } from '@chakra-ui/react';

export const wfLabelsColor = [
  '#7D6608',
  '#43ABC9',
  '#EBC944',
  '#CD6155',
  '#F4D03F',
  '#808B96',
  '#212F3D',
  '#4A340C',
  '#00cd00',
  '#18b5b5',
  '#3A48EC',
  '#EA9D16',
  '#7D3C98',
  '#A6ACAF',
  '#F1948A',
  '#02d500',
  '#AF4141',
  '#EA7616',
  '#A569BD',
  '#68386C',
  '#5A5144',
  '#6F927D',
  '#3AEC60',
  '#EDB152',
  '#C52F38',
  '#A3A042',
  '#249D83',
  '#0DAA79',
  '#3A96EC',
  '#3ADFEC',
  '#5D6D7E',
  '#000080',
  '#229954',
  '#117864',
  '#16A085',
  '#107896',
];

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
