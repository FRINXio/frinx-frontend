import React from 'react';
import { Tag } from '@chakra-ui/react';

type Props = {
  onClick: () => void;
  label: string;
};

function WorkflowLabel({ label, onClick }: Props) {
  return (
    <Tag
      size="sm"
      as="button"
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
      {label}
    </Tag>
  );
}

export default WorkflowLabel;
