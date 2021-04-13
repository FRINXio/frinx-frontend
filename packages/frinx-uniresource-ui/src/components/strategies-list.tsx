import React, { FC } from 'react';
import { useQuery } from 'urql';
import gql from 'graphql-tag';
import CreateNewStrategy from './create-new-strategy';
import DeleteStrategy from './delete-strategy';
import { QueryAllocationStrategiesQuery } from '../__generated__/graphql';

const query = gql`
  query QueryAllocationStrategies {
    QueryAllocationStrategies {
      id
      Name
      Lang
    }
  }
`;

const StrategiesList: FC = () => {
  const [result] = useQuery<QueryAllocationStrategiesQuery>({
    query,
  });

  const { data } = result;

  return (
    <div>
      <div>
        <CreateNewStrategy />
      </div>
      <div>
        <DeleteStrategy />
      </div>
      <ul>
        {data?.QueryAllocationStrategies?.map((strategy) => (
          <li key={strategy.id}>
            {strategy.Name} + {strategy.Lang}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrategiesList;
