import React, { VoidFunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'urql';
import { Heading, Flex, Box } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { useNotifications } from '@frinx/shared/src';
import {
  CreateAllocationStrategyAndResourceTypeMutation,
  CreateAllocationStrategyAndResourceTypeMutationVariables,
  CreateAllocationStrategyInput,
  CreateResourceTypeInput,
} from '../../__generated__/graphql';
import CreateStrategyForm from './create-strategy-form';

const CREATE_STRATEGY_MUTATION = gql`
  mutation CreateAllocationStrategyAndResourceType(
    $stratInput: CreateAllocationStrategyInput!
    $resourceTypeInput: CreateResourceTypeInput!
  ) {
    createStrat: CreateAllocationStrategy(input: $stratInput) {
      strategy {
        id
        Name
        Lang
        Script
      }
    }
    createResourceType: CreateResourceType(input: $resourceTypeInput) {
      resourceType {
        id
        Name
      }
    }
  }
`;
type Props = {
  onSaveButtonClick: () => void;
};

const CreateStrategyPage: VoidFunctionComponent<Props> = ({ onSaveButtonClick }) => {
  const { addToastNotification } = useNotifications();
  const navigate = useNavigate();

  const [, addStrategy] = useMutation<
    CreateAllocationStrategyAndResourceTypeMutation,
    CreateAllocationStrategyAndResourceTypeMutationVariables
  >(CREATE_STRATEGY_MUTATION);

  const handleFormSubmit = ({
    stratInput,
    resourceTypeInput,
  }: {
    stratInput: CreateAllocationStrategyInput;
    resourceTypeInput: CreateResourceTypeInput;
  }) => {
    addStrategy({
      stratInput,
      resourceTypeInput,
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
        <CreateStrategyForm onFormSubmit={handleFormSubmit} onFormCancel={() => navigate(-1)} />
      </Box>
    </>
  );
};

export default CreateStrategyPage;
