import React from "react";
import ReactDOM from "react-dom";
import PoolCard from './pools/PoolCard'
import AllocationStrategies from './configure/AllocationStrategies'
import {graphql, QueryRenderer} from 'react-relay';
import environment from './environment';

ReactDOM.render(
    <div>
        <QueryRenderer
            environment={environment}
            query={graphql`
                query srcResourceTypesQuery {
                        QueryResourceTypes{
                            ID
                            Name
                        }
                }
            `}
            variables={{}}
            render={({error, props}) => {
                console.log(props);
                if (error) {
                    return <div>Error!</div>;
                }
                if (!props) {
                    return <div>Loading...</div>;
                }
                return <div>Name: {props.QueryResourceTypes[0]["Name"]} ID: {props.QueryResourceTypes[0]["ID"]}</div>;
            }}
        />
    </div>,
    document.getElementById("root")
);