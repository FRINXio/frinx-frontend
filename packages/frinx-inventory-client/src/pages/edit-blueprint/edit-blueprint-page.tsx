import { Container, Heading, Box, Progress } from '@chakra-ui/react';
import { gql, useMutation, useQuery } from 'urql';
import React, { FC } from 'react';
import EditBlueprintForm, { FormValues } from './edit-blueprint-form';
import { UpdateBlueprintMutation, UpdateBlueprintMutationVariables } from '../../__generated__/graphql';
import useResponseToasts from '../../hooks/user-response-toasts';

const BLUEPRINT_QUERY = gql`
  query Blueprint($id: ID!) {
    blueprint: node(id: $id) {
      id
      ... on Blueprint {
        name
        template
      }
    }
  }
`;

const UPDATE_BLUEPRINT_MUTATION = gql`
  mutation UpdateBlueprint($id: String!, $input: UpdateBlueprintInput!) {
    updateBlueprint(id: $id, input: $input) {
      blueprint {
        id
        name
        template
      }
    }
  }
`;

type Props = {
  blueprintId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const EditBlueprintPage: FC<Props> = ({ blueprintId, onSuccess, onCancel }) => {
  const [{ data: updateBlueprintData, error: updateBlueprintError }, updateBlueprint] = useMutation<
    UpdateBlueprintMutation,
    UpdateBlueprintMutationVariables
  >(UPDATE_BLUEPRINT_MUTATION);
  const [{ data: blueprint, fetching: isLoadingBlueprint, error }] = useQuery({
    query: BLUEPRINT_QUERY,
    variables: { id: blueprintId },
  });

  const isUpdateSuccessfull = updateBlueprintData != null;
  const isUpdateFailed = updateBlueprintError != null;

  useResponseToasts({
    isSuccess: isUpdateSuccessfull,
    isFailure: isUpdateFailed,
    successMessage: 'Blueprint succesfully edited',
    failureMessage: 'Blueprint could not be edited',
  });

  const handleSubmit = (values: FormValues) => {
    updateBlueprint({
      id: blueprintId,
      input: {
        name: values.name,
        template: values.template,
      },
    }).then(() => {
      onSuccess();
    });
  };

  if (isLoadingBlueprint && blueprint == null) {
    return <Progress isIndeterminate mt={-10} size="xs" />;
  }

  if (!isLoadingBlueprint && error != null) {
    onCancel();
  }

  return (
    <Container maxWidth={1280}>
      <Heading size="3xl" as="h2" mb={2}>
        Edit {blueprint?.blueprint?.name}
      </Heading>
      <Box background="white" boxShadow="base" px={4} py={2}>
        <EditBlueprintForm onSubmit={handleSubmit} onCancel={onCancel} initialValues={blueprint?.blueprint} />
      </Box>
    </Container>
  );
};

export default EditBlueprintPage;
