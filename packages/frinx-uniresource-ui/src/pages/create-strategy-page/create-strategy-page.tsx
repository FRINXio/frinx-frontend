import React, { VoidFunctionComponent } from 'react';
import { useMutation } from 'urql';
import { Heading, Flex, Box } from '@chakra-ui/react';
import gql from 'graphql-tag';
import {
  AllocationStrategyLang,
  CreateAllocationStrategyPayload,
  MutationCreateAllocationStrategyArgs,
} from '../../__generated__/graphql';
import CreateStrategyForm from './create-strategy-form';

const CREATE_STRATEGY_MUTATION = gql`
  mutation AddStrategyMutation($input: CreateAllocationStrategyInput!) {
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

type FormValues = {
  name: string;
  lang: AllocationStrategyLang;
  script: string;
};
type Props = {
  onSaveButtonClick: () => void;
};

const CreateStrategyPage: VoidFunctionComponent<Props> = ({ onSaveButtonClick }) => {
  const [, addStrategy] = useMutation<CreateAllocationStrategyPayload, MutationCreateAllocationStrategyArgs>(
    CREATE_STRATEGY_MUTATION,
  );

  const handleFormSubmit = (values: FormValues) => {
    const variables = {
      input: values,
    };
    // TODO validation
    addStrategy(variables).then(() => {
      onSaveButtonClick();
    });
  };

  return (
    <>
      <Flex as="header" alignItems="center" marginBottom={5}>
        <Heading as="h1" size="lg">
          Create new Strategy
        </Heading>
      </Flex>
      <Box background="white" paddingY={8} paddingX={4}>
        <CreateStrategyForm onFormSubmit={handleFormSubmit} />
      </Box>
    </>
  );
};

export default CreateStrategyPage;
