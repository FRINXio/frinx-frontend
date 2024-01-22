import React, { VoidFunctionComponent } from 'react';
import { Button, chakra, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';
import { useFormik } from 'formik';

export type SearchEventHandlerValues = {
  event?: string | null;
  isActive?: boolean | null;
  evaluatorType?: string | null;
  name?: string | null;
};

type Props = {
  filters?: SearchEventHandlerValues | null;
  onSearchSubmit: (values: SearchEventHandlerValues) => void;
  canDoSearch?: boolean;
};

const INITIAL_VALUES: SearchEventHandlerValues = {
  event: null,
  isActive: null,
  evaluatorType: null,
  name: null,
};

const Form = chakra('form');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventHandlersListSearchbox: VoidFunctionComponent<Props> = ({ filters, onSearchSubmit, canDoSearch }) => {
  const { values, handleChange, submitForm, resetForm } = useFormik<SearchEventHandlerValues>({
    initialValues: filters || INITIAL_VALUES,
    onSubmit: onSearchSubmit,
  });

  const handleOnClearFiltersClick = () => {
    resetForm();
    onSearchSubmit(INITIAL_VALUES);
  };

  return (
    <Form
      mb={8}
      onSubmit={(event) => {
        event.preventDefault();
        submitForm();
      }}
    >
      <HStack spacing={4} mb={5} alignItems="flex-end">
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            background="white"
            id="name"
            name="name"
            placeholder="Name of event handler"
            value={values.name ?? ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="event">Event</FormLabel>
          <Input
            background="white"
            id="event"
            name="event"
            placeholder="Event on which event handler is executed"
            value={values.event ?? ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="evaluatorType">Evaluator type</FormLabel>
          <Input
            background="white"
            id="evaluatorType"
            name="evaluatorType"
            placeholder="Evaluator type"
            value={values.evaluatorType ?? ''}
            onChange={handleChange}
          />
        </FormControl>
        {/* <FormControl alignSelf="flex-start">
          <FormLabel htmlFor="isActive">Is active</FormLabel>
          <Switch id="isActive" name="isActive" isChecked={values.isActive ?? false} onChange={handleChange} />
        </FormControl> */}
        <HStack>
          <Button colorScheme="blue" variant="solid" type="submit">
            Search
          </Button>
          <Button colorScheme="red" variant="outline" onClick={handleOnClearFiltersClick}>
            Clear
          </Button>
        </HStack>
      </HStack>
    </Form>
  );
};

export default EventHandlersListSearchbox;
