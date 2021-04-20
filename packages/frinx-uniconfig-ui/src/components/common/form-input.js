import React from 'react';
import { FormControl, FormLabel, Input, FormHelperText } from '@chakra-ui/react';

const FormInput = ({ value, label, placeholder, description, onChange, ...props }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Input value={value} onChange={onChange} placeholder={placeholder || label} {...props} />
    <FormHelperText>{description}</FormHelperText>
  </FormControl>
);

export default FormInput;
