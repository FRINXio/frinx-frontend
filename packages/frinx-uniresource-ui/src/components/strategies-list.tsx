import React, { FC } from 'react';
import { useQuery } from 'urql';
import { AllocationStrategy } from '../generated/graphql';
import CreateNewStrategy from './create-new-strategy';
import DeleteStrategy from './delete-strategy';

const query = `query QueryAllocationStrategies {
    QueryAllocationStrategies{
       id
       Name
       Lang
    }
}`;

const StrategiesList: FC = () => {
  const [result] = useQuery({
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
        {data?.QueryAllocationStrategies?.map((strategy: AllocationStrategy) => (
          <li key={strategy.id}>
            {strategy.Name} + {strategy.Lang}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrategiesList;
