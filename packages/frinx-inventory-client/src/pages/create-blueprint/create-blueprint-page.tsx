import { Box, Container, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation } from 'urql';
import { AddBlueprintMutation, AddBlueprintMutationVariables } from '../../__generated__/graphql';
import CreateBlueprintForm from './create-blueprint-form';

const ADD_BLUEPRINT_MUTATION = gql`
  mutation AddBlueprint($input: AddBlueprintInput!) {
    deviceInventory {
      addBlueprint(input: $input) {
        blueprint {
          id
          createdAt
          name
        }
      }
    }
  }
`;

type FormValues = {
  name: string;
  template: string;
};
type Props = {
  onCreateSuccess: () => void;
};

const CreateBlueprintPage: VoidFunctionComponent<Props> = ({ onCreateSuccess }) => {
  const [, addBlueprint] = useMutation<AddBlueprintMutation, AddBlueprintMutationVariables>(ADD_BLUEPRINT_MUTATION);

  const handleFormSubmit = (values: FormValues) => {
    addBlueprint({
      input: {
        name: values.name,
        template: values.template,
      },
    }).then(() => {
      onCreateSuccess();
    });
  };

  return (
    <Container maxWidth="container.xl">
      <Heading size="xl" as="h1" marginBottom={6}>
        Create blueprint
      </Heading>
      <Box boxShadow="base" background="white" px={4} py={2}>
        <CreateBlueprintForm onFormSubmit={handleFormSubmit} />
      </Box>
    </Container>
  );
};

export default CreateBlueprintPage;
