import React, { FC } from 'react';
import { useQuery } from 'urql';
import CreateNewStrategy from './create-new-strategy';
import DeleteStrategy from './delete-strategy';
import { Query } from '../__generated__/graphql';

const query = `query QueryAllocationStrategies {
    QueryAllocationStrategies{
       id
       Name
       Lang
    }
}`;

const StrategiesList: FC = () => {
  const [result] = useQuery<Query>({
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
