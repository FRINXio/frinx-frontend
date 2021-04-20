import React from 'react';
import { FormControl, FormLabel, Switch } from '@chakra-ui/react';

const FormSwitch = ({ label, onChange, isChecked, ...props }) => (
  <FormControl display="flex" justifyContent="space-between" alignItems="center">
    <FormLabel mb="0">{label}</FormLabel>
    <Switch isChecked={isChecked} onChange={onChange} {...props} />
  </FormControl>
);

export default FormSwitch;
