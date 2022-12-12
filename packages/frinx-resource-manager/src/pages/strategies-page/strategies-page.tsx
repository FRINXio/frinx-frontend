import { Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared/src';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useCallback, useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import {
  DeleteStrategyMutation,
  DeleteStrategyMutationVariables,
  QueryAllocationStrategiesQuery,
} from '../../__generated__/graphql';
import StrategiesTable from './strategies-table';
import StrategyScriptModal from './strategy-script-modal';

const STRATEGIES_QUERY = gql`
  query QueryAllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
      Lang
      Script
    }
  }
`;
const DELETE_STRATEGY_MUTATION = gql`
  mutation DeleteStrategy($input: DeleteAllocationStrategyInput!) {
    DeleteAllocationStrategy(input: $input) {
      strategy {
        id
      }
    }
  }
`;

type ScriptState = {
  lang: string;
  script: string;
};

const StrategiesPage: VoidFunctionComponent = () => {
  const [scriptState, setScriptState] = useState<ScriptState | null>();
  const { addToastNotification } = useNotifications();
  const context = useMemo(() => ({ additionalTypenames: ['AllocationStrategy'] }), []);
  const [{ data, fetching, error }] = useQuery<QueryAllocationStrategiesQuery>({
    query: STRATEGIES_QUERY,
    context,
  });
  const [, deleteStrategy] = useMutation<DeleteStrategyMutation, DeleteStrategyMutationVariables>(
    DELETE_STRATEGY_MUTATION,
  );

  const handleDeleteBtnClick = useCallback(
    (id: string) => {
      deleteStrategy(
        {
          input: { allocationStrategyId: id },
        },
        { additionalTypenames: ['AllocationStrategy'] },
      )
        .then((response) => {
          if (response.error) {
            addToastNotification({
              content: response.error.message,
              type: 'error',
            });
          } else {
            addToastNotification({
              title: 'Success',
              content: 'Strategy deleted',
              type: 'success',
            });
          }
        })
        .catch((err) => {
          addToastNotification({
            content: err.message,
            type: 'error',
          });
        });
    },
    [deleteStrategy, addToastNotification],
  );
  const handleScriptBtnClick = (lang: string, script: string) => {
    setScriptState({ lang, script });
  };

  if (fetching) {
    return <Progress size="sm" isIndeterminate />;
  }

  if (data == null) {
    return null;
  }

  if (error != null) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <Flex marginBottom={5} alignItems="center">
        <Heading as="h1" size="xl">
          Strategies
        </Heading>
        <Button
          marginLeft="auto"
          leftIcon={<Icon size={20} as={FeatherIcon} icon="plus" />}
          colorScheme="blue"
          as={Link}
          to="new"
        >
          Create new Strategy
        </Button>
      </Flex>
      <StrategiesTable
        strategies={data.QueryAllocationStrategies}
        onDeleteBtnClick={handleDeleteBtnClick}
        onScriptBtnClick={handleScriptBtnClick}
      />
      <StrategyScriptModal
        isOpen={scriptState != null}
        onClose={() => {
          setScriptState(null);
        }}
        {...scriptState}
      />
    </>
  );
};

export default StrategiesPage;
