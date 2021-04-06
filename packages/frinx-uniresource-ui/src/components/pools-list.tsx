import React, {FC} from 'react';
import {useQuery} from "urql";
import {ResourcePool} from "../generated/graphql";

const query = `query QueryAllPools {
    QueryResourcePools{
        id
        Name
        PoolType
        Tags {
            id
            Tag
        }
        AllocationStrategy {
            id
            Name
            Lang
        }
        ResourceType {
            id
            Name
        }
        Capacity {
          freeCapacity
          utilizedCapacity
        }
    }
}`;

const PoolsList: FC = () => {
    const [result] = useQuery({
        query
    });

    const {data} = result;

    return (
        <ul>
            {data?.QueryResourcePools?.map((pool: ResourcePool) => (
                <li key={pool.id}>{pool.Name}</li>
            ))}
        </ul>
    )

};

export default PoolsList;
