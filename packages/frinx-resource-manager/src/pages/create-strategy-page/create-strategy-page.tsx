import React, { VoidFunctionComponent } from 'react';
import { useMutation } from 'urql';
import { Heading, Flex, Box } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useNotifications } from '@frinx/shared/src';
import { CreateAllocationStrategyPayload, MutationCreateAllocationStrategyArgs } from '../../__generated__/graphql';
import CreateStrategyForm, { FormValues } from './create-strategy-form';

const CREATE_STRATEGY_MUTATION = gql`
  mutation CreateAllocationStrategy($input: CreateAllocationStrategyInput!) {
    CreateAllocationStrategy(input: $input) {
      strategy {
        id
        Name
        Lang
        Script
      }
    }
  }
`;
type Props = {
  onSaveButtonClick: () => void;
};

const CreateStrategyPage: VoidFunctionComponent<Props> = ({ onSaveButtonClick }) => {
  const [, addStrategy] = useMutation<CreateAllocationStrategyPayload, MutationCreateAllocationStrategyArgs>(
    CREATE_STRATEGY_MUTATION,
  );
  const { addToastNotification } = useNotifications();

  const handleFormSubmit = (values: FormValues) => {
    addStrategy({
      input: {
        ...values,
        expectedPoolPropertyTypes: values.expectedPoolPropertyTypes?.reduce(
          (acc, curr) => ({ ...acc, [curr.key]: curr.type }),
          {},
        ),
      },
    })
      .then(({ error }) => {
        if (error != null) {
          throw Error;
        }

        addToastNotification({ content: 'Successfully create allocation strategy', type: 'success' });
        onSaveButtonClick();
      })
      .catch(() => addToastNotification({ content: "We couldn't create allocation strategy", type: 'error' }));
  };

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="xl">
          Create new Strategy
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4} marginBottom={5}>
        <CreateStrategyForm onFormSubmit={handleFormSubmit} />
      </Box>
    </>
  );
};

export default CreateStrategyPage;
