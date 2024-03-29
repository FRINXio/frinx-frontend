import { Button, Flex, Heading, Icon, Progress } from '@chakra-ui/react';
import { useNotifications } from '@frinx/shared';
import FeatherIcon from 'feather-icons-react';
import gql from 'graphql-tag';
import React, { useCallback, useMemo, useState, VoidFunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import {
  DeleteStrategyMutation,
  DeleteStrategyMutationVariables,
  QueryAllocationStrategiesQuery,
  DeleteResourceTypeMutation,
  DeleteResourceTypeMutationVariables,
  ResourceTypesQuery,
} from '../../__generated__/graphql';
import StrategiesTable from './strategies-table';
import StrategyScriptModal from './strategy-script-modal';

const STRATEGIES_QUERY = gql`
  query QueryAllocationStrategies {
    resourceManager {
      QueryAllocationStrategies {
        id
        Name
        Lang
        Script
      }
    }
  }
`;
const DELETE_STRATEGY_MUTATION = gql`
  mutation DeleteStrategy($input: DeleteAllocationStrategyInput!) {
    resourceManager {
      DeleteAllocationStrategy(input: $input) {
        strategy {
          id
        }
      }
    }
  }
`;

const DELETE_RESOURCE_TYPE_MUTATION = gql`
  mutation DeleteResourceType($input: DeleteResourceTypeInput!) {
    resourceManager {
      DeleteResourceType(input: $input) {
        resourceTypeId
      }
    }
  }
`;

const RESOURCE_TYPES_QUERY = gql`
  query ResourceTypes {
    resourceManager {
      QueryResourceTypes {
        id
        Name
      }
    }
  }
`;

type ScriptState = {
  lang: string;
  script: string;
  name?: string;
};

const StrategiesPage: VoidFunctionComponent = () => {
  const [scriptState, setScriptState] = useState<ScriptState | null>();
  const { addToastNotification } = useNotifications();
  const context = useMemo(() => ({ additionalTypenames: ['AllocationStrategy'] }), []);
  const [{ data, fetching, error }] = useQuery<QueryAllocationStrategiesQuery>({
    query: STRATEGIES_QUERY,
    context,
  });

  const [{ data: resourceType }] = useQuery<ResourceTypesQuery>({
    query: RESOURCE_TYPES_QUERY,
    context,
  });

  const [, deleteStrategy] = useMutation<DeleteStrategyMutation, DeleteStrategyMutationVariables>(
    DELETE_STRATEGY_MUTATION,
  );
  const [, deleteResourceType] = useMutation<DeleteResourceTypeMutation, DeleteResourceTypeMutationVariables>(
    DELETE_RESOURCE_TYPE_MUTATION,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const findResourceTypeId = useCallback(
    (id: string) => {
      const StrategyById = data?.resourceManager.QueryAllocationStrategies.find((type) => type.id === id)?.Name;
      const typeName = resourceType?.resourceManager.QueryResourceTypes.find((type) => type.Name === StrategyById);
      return typeName?.id;
    },
    [data?.resourceManager.QueryAllocationStrategies, resourceType?.resourceManager.QueryResourceTypes],
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
            const resourceTypeId = findResourceTypeId(id);

            if (resourceTypeId) {
              deleteResourceType({ input: { resourceTypeId } })
                .then(({ error: deleteResourceTypeError }) => {
                  if (deleteResourceTypeError != null) {
                    throw Error();
                  }
                  addToastNotification({ content: 'Resource type deleted successfully', type: 'success' });
                })
                .catch(() => addToastNotification({ content: 'Resource type deletion failed', type: 'error' }));
            }
            if (!resourceTypeId) {
              addToastNotification({ content: 'Resource type could not be found', type: 'error' });
            }
          }
        })
        .catch((err) => {
          addToastNotification({
            content: err.message,
            type: 'error',
          });
        });
    },
    [deleteStrategy, addToastNotification, deleteResourceType, findResourceTypeId],
  );
  const handleScriptBtnClick = (lang: string, script: string, name?: string) => {
    setScriptState({ lang, script, name });
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
          data-cy="new-strategy-btn"
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
        strategies={data.resourceManager.QueryAllocationStrategies}
        onDeleteBtnClick={handleDeleteBtnClick}
        onScriptBtnClick={handleScriptBtnClick}
      />
      <StrategyScriptModal
        isOpen={scriptState != null}
        onClose={() => {
          setScriptState(null);
        }}
        {...scriptState}
        strategyName={scriptState?.name}
      />
    </>
  );
};

export default StrategiesPage;
