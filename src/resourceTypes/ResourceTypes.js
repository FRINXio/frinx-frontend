/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ContextRouter} from 'react-router-dom';
// import type {ServiceTypeItem_serviceType} from './__generated__/ServiceTypeItem_serviceType.graphql';
import type {WithStyles} from '@material-ui/core';

import * as axios from 'axios';
// import AddEditResourceTypeCard from './AddEditResourceTypeCard';
import React, {useState} from 'react';
import ResourceTypeItem from './ResourceTypeItem';
import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddEditResourceTypeCard from "../strategies/AddEditResourceTypeCard";
import ResourceManagerQueryRenderer from "../utils/relay/ResourceManagerQueryRenderer";
import {fetchQuery, queryResourceTypes} from "../queries/Queries";
// import {queryResourceTypes} from "../../queries/Queries";

const styles = theme => ({
    header: {
        margin: '10px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    root: {
        width: '100%',
        marginTop: '15px',
    },
    paper: {
        flexGrow: 1,
        overflowY: 'hidden',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    listItem: {
        marginBottom: theme.spacing(),
    },
    addButton: {
        marginLeft: 'auto',
    },
    addButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    typesList: {
        padding: '24px',
    },
    title: {
        marginLeft: '10px',
    },
    firstRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

type Props = ContextRouter & WithStyles<typeof styles> & {};

type State = {
    dialogKey: number,
    errorMessage: ?string,
    showAddEditCard: boolean,
};

const query = graphql`query ResourceTypesQuery {
                        QueryResourceTypes{
                            ID
                            Name
                        }
                }
`;

class ResourceTypes extends React.Component<Props, State> {
    state = {
        dialogKey: 1,
        errorMessage: null,
        showAddEditCard: false,
        editingServiceType: null,
        resourceTypesData: [],
    };

    componentDidMount() {
        fetchQuery(queryResourceTypes).then(val => {
            console.log(val.data.data.QueryResourceTypes);
            this.setState({resourceTypesData: val.data.data.QueryResourceTypes});
        });
    }

    render() {
        const {classes} = this.props;
        const {showAddEditCard, editingServiceType, resourceTypesData} = this.state;
        // const [resourceTypesData, setResourceTypesData] = useState([]);

        return (
            <ResourceManagerQueryRenderer
                query={query}
                variables={{}}
                render={props => {
                    const {serviceTypes} = props;

                    if (showAddEditCard) {
                        return (
                            <div className={classes.paper}>
                                <AddEditResourceTypeCard />
                            </div>
                        );
                    }

                    return (
                        <div>
                            <div className={classes.typesList}>
                                <div className={classes.addButtonContainer}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {this.setState({
                                            showAddEditCard: true
                                        })}}>Add Resource Type</Button>
                                </div>
                            </div>

                            <div className={classes.typesList}>
                                {resourceTypesData.map((rt, key: id) => {
                                    return <div className={classes.listItem}>
                                        <ResourceTypeItem resourceType={rt}/>
                                    </div>
                                })}
                            </div>
                        </div>
                    );
                }}
            />
        );
    }
}

export default withStyles(styles)(
    // createFragmentContainer(ResourceTypes, {
    //     resourceTypes: graphql`
    //        fragment ResourceTypes_resourceTypes on ResourceType {
    //         ID
    //         Name
    //        }
    //     `
    // })
    // ,
    ResourceTypes
);

