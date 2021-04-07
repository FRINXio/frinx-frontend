import React, { FC } from 'react';
import { useQuery } from 'urql';
import { ResourceType } from '../generated/graphql';

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
  const [result] = useQuery({
    query,
  });

  const { data } = result;

  return (
    <ul>
      {data?.QueryResourceTypes?.map((rt: ResourceType) => (
        <li key={rt.id}>{rt.Name}</li>
      ))}
    </ul>
  );
};

export default ResourceTypesList;
