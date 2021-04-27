import React from 'react';
import { GridItem, Textarea, FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';

const NetconfCapabilitiesForm = ({ netconfAdvForm, setNetconfAdvForm }) => (
  <GridItem colSpan={12}>
    <FormControl>
      <FormLabel>Capabilities</FormLabel>
      <Textarea
        value={netconfAdvForm['netconf-node-topology:yang-module-capabilities']}
        onChange={(e) => {
          e.persist();
          setNetconfAdvForm((prev) => ({
            ...prev,
            'netconf-node-topology:yang-module-capabilities': e.target.value,
          }));
        }}
      />
      <FormHelperText>Capabilities</FormHelperText>
    </FormControl>
  </GridItem>
);

export default NetconfCapabilitiesForm;
