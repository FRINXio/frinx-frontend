import React, { VoidFunctionComponent } from 'react';
import { Button, ButtonGroup, Card, FormControl, FormLabel, HStack, Input, Spacer, Switch } from '@chakra-ui/react';
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

const EventHandlersListSearchbox: VoidFunctionComponent<Props> = ({ filters, onSearchSubmit, canDoSearch }) => {
  const { values, handleChange, submitForm, handleReset } = useFormik<SearchEventHandlerValues>({
    initialValues: filters || INITIAL_VALUES,
    onSubmit: onSearchSubmit,
  });

  return (
    <Card p={10} mb={5}>
      <HStack spacing={4} mb={5}>
        <FormControl>
          <FormLabel htmlFor="event">Event</FormLabel>
          <Input
            id="event"
            name="event"
            placeholder="Event on which event handler is executed"
            value={values.event ?? ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            name="name"
            placeholder="Name of event handler"
            value={values.name ?? ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="evaluatorType">Evaluator type</FormLabel>
          <Input
            id="evaluatorType"
            name="evaluatorType"
            placeholder="Evaluator type"
            value={values.evaluatorType ?? ''}
            onChange={handleChange}
          />
        </FormControl>
      </HStack>

      <HStack>
        <FormControl>
          <FormLabel htmlFor="isActive">Is active</FormLabel>
          <Switch id="isActive" name="isActive" isChecked={values.isActive ?? false} onChange={handleChange} />
        </FormControl>

        <Spacer />

        <ButtonGroup variant="outline" isDisabled={!canDoSearch}>
          <Button onClick={handleReset}>Clear</Button>

          <Button colorScheme="blue" onClick={submitForm}>
            Search
          </Button>
        </ButtonGroup>
      </HStack>
    </Card>
  );
};

export default EventHandlersListSearchbox;
