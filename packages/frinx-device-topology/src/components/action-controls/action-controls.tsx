import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { setWeightVisibility } from '../../state.actions';
import { useStateContext } from '../../state.provider';

const ActionControls: VoidFunctionComponent = () => {
  const { dispatch, state } = useStateContext();
  const { isWeightVisible } = state;

  const handleSwitchVisibility = () => {
    dispatch(setWeightVisibility(!isWeightVisible));
  };

  return (
    <Box background="white" padding="0.5em">
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="isVisible" mb={0} fontSize="sm" fontWeight="normal">
          show weights
        </FormLabel>
        <Switch id="isVisible" isChecked={isWeightVisible} onChange={handleSwitchVisibility} size="sm" />
      </FormControl>
    </Box>
  );
};

export default ActionControls;
