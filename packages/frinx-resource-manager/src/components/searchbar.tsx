import React, { VoidFunctionComponent } from 'react';
import { Input, InputProps } from '@chakra-ui/react';

type Props = {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputProps;

export const Searchbar: VoidFunctionComponent<Props> = ({ placeholder, value, onChange, ...props }) => {
  return (
    <Input value={value} onChange={onChange} variant="outline" bgColor="white" placeholder={placeholder} {...props} />
  );
};
