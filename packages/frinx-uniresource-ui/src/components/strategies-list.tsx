import React, { FC } from 'react';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import { Button, Flex, Heading, Icon, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import FeatherIcon from 'feather-icons-react';
import DeleteStrategy from './delete-strategy';
import { QueryAllocationStrategiesQuery } from '../__generated__/graphql';
import ViewStrategyScript from './view-strategy-script';

const query = gql`
  query QueryAllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
      Lang
      Script
    }
  }
`;

type Props = {
  onAddButtonClick: () => void;
};

const StrategiesList: FC<Props> = ({ onAddButtonClick }) => {
  const [result] = useQuery<QueryAllocationStrategiesQuery>({
    query,
  });

  const { data } = result;

  return (
    <div>
      <Flex marginBottom={4} justifyContent="space-between">
        <Heading>Strategies</Heading>
        <Button
          icon={<Icon size={20} as={FeatherIcon} icon="plus" />}
          colorScheme="blue"
          onClick={() => {
            onAddButtonClick();
          }}
        >
          {' '}
          Create new Strategy{' '}
        </Button>
      </Flex>
      <ul>
        <Table background="white">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Lang</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.QueryAllocationStrategies?.map((strategy) => (
              <Tr key={strategy.id}>
                <Td>{strategy.Name}</Td>
                <Td>{strategy.Lang}</Td>
                <Td>
                  <Flex>
                    <DeleteStrategy allocationStrategyId={strategy.id} />
                    <ViewStrategyScript script={strategy.Script} lang={strategy.Lang} />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ul>
    </div>
  );
};

export default StrategiesList;
