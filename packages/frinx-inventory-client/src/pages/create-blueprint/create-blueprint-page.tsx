import { Box, Container, Heading } from '@chakra-ui/react';
import React, { VoidFunctionComponent } from 'react';
import { gql, useMutation } from 'urql';
import { AddBlueprintMutation, AddBlueprintMutationVariables } from '../../__generated__/graphql';
import CreateBlueprintForm from './create-blueprint-form';

const ADD_BLUEPRINT_MUTATION = gql`
  mutation AddBlueprint($input: AddBlueprintInput!) {
    addBlueprint(input: $input) {
      blueprint {
        id
        createdAt
        name
      }
    }
  }
`;

const CreateBlueprintPage: VoidFunctionComponent = () => {
  const [, addBlueprint] = useMutation<AddBlueprintMutation, AddBlueprintMutationVariables>(ADD_BLUEPRINT_MUTATION);

  const handleFormSubmit = () => {
    addBlueprint();
  };

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Add blueprint
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2}>
        <CreateBlueprintForm onFormSubmit={handleFormSubmit} />
      </Box>
    </Container>
  );
};

export default CreateBlueprintPage;
