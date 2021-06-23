import gql from 'graphql-tag';
import React, { FC } from 'react';
import { useQuery } from 'urql';
import { ResourceTypesQuery } from '../__generated__/graphql';
import CreateNewResourceType from './create-new-resource-type';
import DeleteResourceType from './delete-resource-type';

const RESOURCE_TYPES_QUERY = gql`
  query ResourceTypes {
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
  const [result] = useQuery<ResourceTypesQuery>({
    query: RESOURCE_TYPES_QUERY,
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
