import React, { FC } from 'react';
import { useQuery } from 'urql';
import { Query } from '../__generated__/graphql';
import CreateNewResourceType from './create-new-resource-type';
import DeleteResourceType from './delete-resource-type';

const query = `query ResourceTypesQuery {
    QueryResourceTypes {
      id
      Name
      PropertyTypes {
        Name
        Type
      }
      Pools {
        id
        Name
      }
    }
  }
`;

const ResourceTypesList: FC = () => {
  const [result] = useQuery<Query>({
    query,
  });

  const { data } = result;

  return (
    <div>
      <CreateNewResourceType />
      <DeleteResourceType />
      <ul>
        {data?.QueryResourceTypes?.map((rt) => (
          <li key={rt.id}>
            {rt.Name} : {rt.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceTypesList;
