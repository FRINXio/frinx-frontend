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
  useToast,
} from '@chakra-ui/react';
import gql from 'graphql-tag';
import FeatherIcon from 'feather-icons-react';
import { DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs } from '../__generated__/graphql';

const query = gql`
  mutation DeletePoolMutation($input: DeleteResourcePoolInput!) {
    DeleteResourcePool(input: $input) {
      resourcePoolId
    }
  }
`;

type DeletePoolProps = {
  poolId: string;
};

const DeletePool: FC<DeletePoolProps> = ({ poolId }) => {
  const [res, addStrategy] = useMutation<DeleteResourcePoolPayload, MutationDeleteResourcePoolArgs>(query);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const toast = useToast();
  const cancelRef = useRef<HTMLDivElement>();

  const { fetching } = res;

  const sendMutation = async () => {
    const variables = {
      input: {
        resourcePoolId: poolId,
      },
    };
    await addStrategy(variables);
    setIsAlertOpen(false);
    toast({
      title: `test`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
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
            <AlertDialogHeader fontSize="lg">Delete Pool</AlertDialogHeader>
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

export default DeletePool;
