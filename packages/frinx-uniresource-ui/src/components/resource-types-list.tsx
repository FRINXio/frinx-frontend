import gql from 'graphql-tag';
import React, { FC } from 'react';
import { useQuery } from 'urql';
import { ResourceTypesQueryQuery } from '../__generated__/graphql';
import CreateNewResourceType from './create-new-resource-type';
import DeleteResourceType from './delete-resource-type';

const query = gql`
  query ResourceTypesQuery {
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
  const [result] = useQuery<ResourceTypesQueryQuery>({
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
