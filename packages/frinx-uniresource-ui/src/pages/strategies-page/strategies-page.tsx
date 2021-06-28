import React, { FC, useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation } from 'urql';
import gql from 'graphql-tag';
import { Button, Flex, Heading, Icon, Spinner } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import {
  QueryAllocationStrategiesQuery,
  DeleteStrategyMutation,
  DeleteStrategyMutationVariables,
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
type Props = {
  onAddButtonClick: () => void;
};

const StrategiesPage: FC<Props> = ({ onAddButtonClick }) => {
  const [scriptState, setScriptState] = useState<ScriptState | null>();
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
      );
    },
    [deleteStrategy],
  );
  const handleScriptBtnClick = (lang: string, script: string) => {
    setScriptState({ lang, script });
  };

  if (fetching) {
    return <Spinner size="xl" />;
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
        <Heading as="h1" size="lg">
          Strategies
        </Heading>
        <Button
          marginLeft="auto"
          icon={<Icon size={20} as={FeatherIcon} icon="plus" />}
          colorScheme="blue"
          onClick={() => {
            onAddButtonClick();
          }}
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
