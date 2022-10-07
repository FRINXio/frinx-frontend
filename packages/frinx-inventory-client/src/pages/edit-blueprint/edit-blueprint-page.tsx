import { Box, Container, Heading, Progress } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from 'urql';
import { useResponseToasts } from '@frinx/shared/src';
import { UpdateBlueprintMutation, UpdateBlueprintMutationVariables } from '../../__generated__/graphql';
import EditBlueprintForm, { FormValues } from './edit-blueprint-form';

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
  onSuccess: () => void;
  onCancel: () => void;
};

const EditBlueprintPage: FC<Props> = ({ onSuccess, onCancel }) => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
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
    successMessage: 'Blueprint successfully edited',
    failureMessage: 'Blueprint could not be edited',
  });

  if (blueprintId == null) {
    return null;
  }

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
