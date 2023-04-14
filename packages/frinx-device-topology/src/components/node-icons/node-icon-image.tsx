import { chakra } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  sizeTransform: string;
};

const G = chakra('g');

const NodeIconImage: VoidFunctionComponent<Props> = ({ sizeTransform }) => {
  return (
    <G
      fill="none"
      stroke="gray.600"
      strokeWidth="2px"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={sizeTransform}
    >
      <path strokeWidth="1.2" d="M9 21H3v-6M15 3h6v6M21 3l-7 7M3 21l7-7" />
      <g strokeWidth="1.2">
        <path transform="rotate(90 12 1)" strokeWidth="1.2" d="M15 3h6v6" />
        <path strokeWidth="1.2" d="m9.975 3-7 7" transform="rotate(90 6.488 6.513)" />
      </g>
      <g strokeWidth="1.2">
        <path transform="rotate(-90 23.06 12)" strokeWidth="1.2" d="M15 3h6v6" />
        <path strokeWidth="1.2" d="m9.975 3-7 7" transform="rotate(-90 17.547 6.488)" />
      </g>
    </G>
  );
};

export default NodeIconImage;
