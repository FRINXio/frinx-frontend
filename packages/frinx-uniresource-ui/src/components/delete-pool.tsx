import React, { FC } from 'react';
import { useMutation } from 'urql';
import { Button } from '@chakra-ui/react';
import gql from 'graphql-tag';
import { DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs } from '../__generated__/graphql';

const query = gql`
  mutation DeletePoolMutation($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

type DeletePoolProps = {
  poolId: string
}

const DeletePool: FC<DeletePoolProps> = ({poolId}) => {
  const [, addStrategy] = useMutation<DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs>(query);

  const sendMutation = () => {
    const variables = {
      input: {
        resourcePoolId: poolId,
      },
    };
    addStrategy(variables);
  };
  return (
    <div>
      <Button onClick={() => sendMutation()}>Delete</Button>
    </div>
  );
};

export default DeletePool;
