import React from 'react';
import { GridItem } from '@chakra-ui/react';
import FormInput from '../../../../common/form-input';

const KeepaliveForm = ({ cliAdvForm, setCliAdvForm }) => (
  <>
    <GridItem key="cli-topology:keepalive-delay" colSpan={4}>
      <FormInput
        label="Keepalive delay"
        value={cliAdvForm['cli-topology:keepalive-delay']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({ ...prev, 'cli-topology:keepalive-delay': e.target.value }));
        }}
        description="Delay (in seconds) between sending of keepalive messages over CLI session"
      />
    </GridItem>
    <GridItem key="cli-topology:keepalive-timeout" colSpan={4}>
      <FormInput
        label="Keepalive timeout"
        value={cliAdvForm['cli-topology:keepalive-timeout']}
        onChange={(e) => {
          e.persist();
          setCliAdvForm((prev) => ({ ...prev, 'cli-topology:keepalive-timeout': e.target.value }));
        }}
        description="Close connection if keepalive response is not received within specified seconds"
      />
    </GridItem>
  </>
);

export default KeepaliveForm;
