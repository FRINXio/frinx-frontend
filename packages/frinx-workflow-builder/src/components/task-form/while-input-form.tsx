import React, { FC } from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { WhileInputParams } from '../../helpers/types';

type Props = {
  params: WhileInputParams;
  onChange: (p: WhileInputParams) => void;
};

const WhileInputForm: FC<Props> = ({ params, onChange }) => {
  const { iterations } = params;

  return (
    <FormControl id="iterations" my={6}>
        <FormLabel>Iterations</FormLabel>
        <Input
          name="iterations"
          variant="filled"
          value={iterations}
          onChange={(event) => {
            event.persist();
            onChange({
              iterations: Number(event.target.value),
            });
          }}
        />
      </FormControl>
  );
};

export default WhileInputForm;
