import React from 'react';
import { GridItem } from '@chakra-ui/react';
import FormInput from '../../../../common/form-input';

const LazyConnectionForm = ({ cliAdvForm, setCliAdvForm }) => (
  <>
    <GridItem key="cli-topology:command-timeout" colSpan={4}>
      <FormInput
        label="Command timeout"
        value={cliAdvForm['cli-topology:command-timeout']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({ ...prev, 'cli-topology:command-timeout': e.target.value }));
        }}
        description="Maximal time (in seconds) for command execution"
      />
    </GridItem>
    <GridItem key="cli-topology:connection-lazy-timeout" colSpan={4}>
      <FormInput
        label="Connection lazy timeout"
        value={cliAdvForm['cli-topology:connection-lazy-timeout']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({ ...prev, 'cli-topology:connection-lazy-timeout': e.target.value }));
        }}
        description="Maximal time (in seconds) for connection to keep alive"
      />
    </GridItem>
    <GridItem key="cli-topology:connection-establish-timeout" colSpan={4}>
      <FormInput
        label="Connection establish timeout"
        value={cliAdvForm['cli-topology:connection-establish-timeout']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({ ...prev, 'cli-topology:connection-establish-timeout': e.target.value }));
        }}
        description="Maximal time (in seconds) for connection establishment"
      />
    </GridItem>
  </>
);

export default LazyConnectionForm;
