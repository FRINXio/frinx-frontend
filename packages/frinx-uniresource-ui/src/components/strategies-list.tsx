import React, {FC} from 'react';
import {useQuery} from "urql";
import {AllocationStrategy} from "../generated/graphql";

const query = `query QueryAllocationStrategies {
    QueryAllocationStrategies{
       id
       Name
       Lang
    }
}`;

const StrategiesList: FC = () => {
    const [result] = useQuery({
        query
    });

    const {data} = result;

    return (
        <ul>
            {data?.QueryAllocationStrategies?.map((strategy: AllocationStrategy) => (
                <li key={strategy.id}>{strategy.Name} + {strategy.Lang}</li>
            ))}
        </ul>
    )

};

export default StrategiesList;
