import React, { ChangeEvent, FC, useState } from 'react';
import {
  ButtonGroup,
  Button,
  FormControl,
  Input,
  Card,
  HStack,
  FormLabel,
  Select,
  Checkbox,
  Spacer,
} from '@chakra-ui/react';
import debounce from 'lodash/debounce';

type Props = {
  showFlat: boolean;
  labels: string[];
  changeLabels: (e: string[]) => void;
  changeView: () => void;
  changeQuery: (e: string) => void;
};

const ExecutedWorkflowSearchBox: FC<Props> = ({ changeLabels, changeQuery, changeView, showFlat, labels }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    const debounced = debounce(changeQuery, 300);
    debounced(event.target.value);
  };

  return (
    <Card shadow="md" rounded="lg" backgroundColor="white" p={15}>
      <HStack>
        <FormControl>
          <FormLabel>Workflow Name</FormLabel>
          <Input value={searchText} onChange={handleSearchChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow ID</FormLabel>
          <Input
            value=""
            // onChange={() => {}}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Workflow Status</FormLabel>
          <Select placeholder="Select option" onChange={(e) => changeLabels([e.target.value])}>
            {labels.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack mt={15}>
        <FormControl>
          <FormLabel>Start Time (From)</FormLabel>
          <Input
            value=""
            // onChange={() => {}}
            type="datetime-local"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Start Time (To)</FormLabel>
          <Input
            value=""
            // onChange={() => {}}
            type="datetime-local"
          />
        </FormControl>

        <Spacer />

        <FormControl>
          <FormLabel>Workflows per page</FormLabel>
          <Select
            placeholder="Select option"
            // onChange={() => {}}
            // onSelect={() => {}}
          >
            {[10, 20, 50, 100].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>

      <HStack mt={15}>
        <FormControl>
          <Checkbox isChecked={showFlat} onChange={changeView}>
            Only root workflows
          </Checkbox>
        </FormControl>
      </HStack>

      <HStack mt={15}>
        <Spacer />

        <ButtonGroup>
          <Button>Clear</Button>
          <Button colorScheme="blue">Search</Button>
        </ButtonGroup>
      </HStack>
    </Card>
  );
};

export default ExecutedWorkflowSearchBox;
