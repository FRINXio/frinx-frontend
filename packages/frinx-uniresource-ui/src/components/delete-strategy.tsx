import React, { FC, useRef, useState } from 'react';
import { useMutation } from 'urql';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import gql from 'graphql-tag';
import FeatherIcon from 'feather-icons-react';
import { DeleteAllocationStrategyPayload, MutationDeleteAllocationStrategyArgs } from '../__generated__/graphql';

const query = gql`
  mutation DeleteStrategyMutation($input: DeleteAllocationStrategyInput!) {
    DeleteAllocationStrategy(input: $input) {
      strategy {
        id
      }
    }
  }
`;

type DeleteStrategyProps = {
  allocationStrategyId: string;
};

const DeleteStrategy: FC<DeleteStrategyProps> = ({ allocationStrategyId }) => {
  const [res, addStrategy] = useMutation<DeleteAllocationStrategyPayload, MutationDeleteAllocationStrategyArgs>(query);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { fetching } = res;

  const cancelRef = useRef<HTMLDivElement>();

  const sendMutation = () => {
    const variables = {
      input: {
        allocationStrategyId,
      },
    };
    addStrategy(variables);
  };
  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg">Delete Strategy</AlertDialogHeader>
            <AlertDialogBody>Are you sure? You can&apos;t undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ref={cancelRef}
                onClick={() => {
                  setIsAlertOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button isLoading={fetching} colorScheme="red" onClick={() => sendMutation()} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div>
        <IconButton
          variant="outline"
          colorScheme="red"
          aria-label="delete"
          icon={<Icon size={20} as={FeatherIcon} icon="trash-2" color="red" />}
          onClick={() => setIsAlertOpen(true)}
        />
      </div>
    </>
  );
};

export default DeleteStrategy;
