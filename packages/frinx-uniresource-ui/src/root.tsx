import {ChakraProvider, Heading} from '@chakra-ui/react';
import {createClient, Provider} from 'urql';
import React, {FC} from 'react';
import PoolsList from "./components/pools-list";
import StrategiesList from "./components/strategies-list";
import CreateNewStrategy from "./components/CreateNewStrategy";

const client = createClient({
    url: 'http://10.19.0.7/resourcemanager/graphql/query',
});


const Root: FC = () => {
    return (
        <Provider value={client}>
            <ChakraProvider>
                <Heading as="h1" size="xl">
                    <PoolsList />
                    <StrategiesList />
                    <CreateNewStrategy />
                </Heading>
            </ChakraProvider>
        </Provider>
    );
};

export default Root;
