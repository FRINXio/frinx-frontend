import React, { VoidFunctionComponent } from 'react';
import { Box, Checkbox } from '@chakra-ui/react';

type Props = {
  devicesAmount: number | null;
  selectedDevicesAmount: number | null;
  onSelectAll: (checked: boolean) => void;
  areSelectedAll: boolean;
};

const formatAmount = (amount: number | null): number => (amount == null ? 0 : amount);

const DeviceSelectBox: VoidFunctionComponent<Props> = ({
  devicesAmount,
  selectedDevicesAmount,
  onSelectAll,
  areSelectedAll = false,
}) => {
  const devicesLength = formatAmount(devicesAmount);
  const selectedDevicesLength = formatAmount(selectedDevicesAmount);
  return (
    <Box pb={4}>
      <p>
        selected {selectedDevicesLength} from {devicesLength} {devicesLength > 1 ? 'devices' : 'device'}
      </p>
      <Checkbox isChecked={areSelectedAll} onChange={(e) => onSelectAll(e.target.checked)}>
        Select all
      </Checkbox>
    </Box>
  );
};

export default DeviceSelectBox;
