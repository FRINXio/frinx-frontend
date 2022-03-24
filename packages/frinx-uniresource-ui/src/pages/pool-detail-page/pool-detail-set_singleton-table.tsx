import { Table, Thead, Tr, Th, Tbody, Td, ButtonGroup, Button } from '@chakra-ui/react';
import { keys } from 'lodash';
import React, { VoidFunctionComponent } from 'react';
import { AllocatedResourcesQuery, Maybe, Resource } from '../../__generated__/graphql';

type PoolResources = Array<
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename?: 'Resource';
  } & Pick<Resource, 'Description' | 'Properties' | 'id'>
>;

type Props = {
  allocatedResources: AllocatedResourcesQuery['QueryResources'];
  resources: PoolResources;
  onFreeResource: (userInput: Record<string, string | number>) => void;
};

const getNamesOfAllocatedResources = (
  allocatedResources: Array<{
    isClaimed: boolean;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename?: 'Resource' | undefined;
    Description: Maybe<string>;
    Properties: Record<string, string | number>;
    id: string;
  }>,
) => {
  if (allocatedResources == null) return [];

  return Array.from(new Set(allocatedResources.map((res) => keys(res.Properties)).flat()));
};

const PoolDetailSetSingletonTable: VoidFunctionComponent<Props> = ({
  onFreeResource,
  resources,
  allocatedResources,
}) => {
  const mappedResources = resources.map((resource) => {
    if (allocatedResources.find((res) => res.id === resource.id)) {
      return { ...resource, isClaimed: true };
    }

    return { ...resource, isClaimed: false };
  });
  const allocatedResourcesKeys = getNamesOfAllocatedResources(mappedResources);

  return (
    <Table background="white">
      <Thead>
        <Tr>
          {allocatedResourcesKeys.map((key) => (
            <Th key={key}>{key}</Th>
          ))}
          <Th>state</Th>
          <Th>action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {mappedResources != null && mappedResources.length > 0 ? (
          mappedResources.map((resource) => {
            return (
              <Tr key={resource.id}>
                {allocatedResourcesKeys.map((key) => {
                  return <Td key={`${key}-${resource.id}`}>{resource.Properties[key]}</Td>;
                })}
                <Td>{resource.isClaimed ? 'Claimed' : 'Unclaimed'}</Td>
                <Td>
                  <ButtonGroup>
                    <Button isDisabled={!resource.isClaimed} onClick={() => onFreeResource(resource.Properties)}>
                      Deallocate
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            );
          })
        ) : (
          <Tr>
            <Td>There are no allocated resources yet.</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default PoolDetailSetSingletonTable;
