import React, { VoidFunctionComponent } from 'react';
import { Input } from '@chakra-ui/react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Searchbar: VoidFunctionComponent<Props> = ({ value, onChange }) => {
  return (
    <Input value={value} onChange={onChange} mb={5} variant="outline" bgColor="white" placeholder="Search by name" />
  );
};
