import { Select } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';

type Props = {
  first: number | undefined;
  last: number | undefined;
  setItemsCount: (value: number) => void;
};

const itemCountOptions = [5, 10, 20, 50, 100];

const SelectItemsPerPage: VoidFunctionComponent<Props> = ({ first, last, setItemsCount }) => {
  return (
    <Select
      mt={4}
      width="fit-content"
      data-cy="select-page-items-count"
      value={first ?? last}
      onChange={(e) => setItemsCount(Number(e.target.value))}
      variant="outline"
      bgColor="white"
    >
      {itemCountOptions.map((option) => {
        return (
          <option key={option} value={option}>
            {option}
          </option>
        );
      })}
    </Select>
  );
};

export default SelectItemsPerPage;
