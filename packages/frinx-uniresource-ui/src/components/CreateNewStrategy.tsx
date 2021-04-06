import React, {FC} from 'react';
import {useMutation} from "urql";
import {Button} from "@chakra-ui/react";

const query = `
    mutation AddStrategyMutation($input: CreateAllocationStrategyInput!) {
        CreateAllocationStrategy(input: $input) {
            strategy {
                id
                Name
                Lang
                Script
            }
        }
    }
`;

const CreateNewStrategy: FC = () => {
    const [result, addStrategy] = useMutation(query);

    const sendMutation = () => {

        const variables = {input: {name: 'Strin3', lang: 'js', script: 'function invoke() {log(JSON.stringify({respool: resourcePool.ResourcePoolName, currentRes: currentResources}));return {vlan: userInput.desiredVlan};}'}}
        addStrategy(variables)
        console.log(result);
    }
    return (
        <div>
            <Button onClick={() => sendMutation()}>
                asd
            </Button>
        </div>
    )

};

export default CreateNewStrategy;

