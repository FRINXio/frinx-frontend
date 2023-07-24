import React, { VoidFunctionComponent } from 'react';
import { Button, ButtonGroup, Card, FormControl, FormLabel, HStack, Input, Spacer, Switch } from '@chakra-ui/react';
import { useFormik } from 'formik';

export type SearchEventHandlerValues = {
  event: string;
  isActive: boolean;
  evaluatorType: string;
  name: string;
};

type Props = {
  onSearchSubmit: (values: SearchEventHandlerValues) => void;
};

const INITIAL_VALUES: SearchEventHandlerValues = {
  event: '',
  isActive: false,
  evaluatorType: '',
  name: '',
};

const EventHandlersListSearchbox: VoidFunctionComponent<Props> = ({ onSearchSubmit }) => {
  const { values, handleChange, handleReset, submitForm } = useFormik<SearchEventHandlerValues>({
    initialValues: INITIAL_VALUES,
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
            value={values.event}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            name="name"
            placeholder="Name of event handler"
            value={values.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="evaluatorType">Evaluator type</FormLabel>
          <Input
            id="evaluatorType"
            name="evaluatorType"
            placeholder="Evaluator type"
            value={values.evaluatorType}
            onChange={handleChange}
          />
        </FormControl>
      </HStack>

      <HStack>
        <FormControl>
          <FormLabel htmlFor="isActive">Is active</FormLabel>
          <Switch id="isActive" name="isActive" isChecked={values.isActive} onChange={handleChange} />
        </FormControl>

        <Spacer />

        <ButtonGroup variant="outline">
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
