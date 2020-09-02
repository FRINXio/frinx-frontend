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

        if(showAddEditCard) {
            return <AddEditResourceTypeCard />
        }

        return (
            <ResourceManagerQueryRenderer
                query={query}
                variables={{}}
                render={props => {
                    const {serviceTypes} = props;

                    if (showAddEditCard) {
                        return (
                            <div className={classes.paper}>
                                {/*<AddEditResourceTypeCard*/}
                                {/*    key={'new_service_type@' + this.state.dialogKey}*/}
                                {/*    open={showAddEditCard}*/}
                                {/*    onClose={this.hideAddEditServiceTypeCard}*/}
                                {/*    onSave={this.saveService}*/}
                                {/*    editingServiceType={editingServiceType}*/}
                                {/*/>*/}
                            </div>
                        );
                    }

                    return (
                        <div>
                            <div className={classes.typesList}>
                                <div className={classes.firstRow}>
                                    {/*<ConfigueTitle*/}
                                    {/*    className={classes.title}*/}
                                    {/*    title={fbt('sssResource Types', 'Resource Types header')}*/}
                                    {/*    subtitle={fbt(*/}
                                    {/*        'Add and manage the types of resources that are used in your network topology.',*/}
                                    {/*        'Service Types subheader',*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                    <div className={classes.addButtonContainer}>
                                        {/*<FormActionWithPermissions*/}
                                        {/*    permissions={{entity: 'serviceType', action: 'create'}}>*/}
                                        {/*    <Button*/}
                                        {/*        className={classes.addButton}*/}
                                        {/*        onClick={() => this.showAddEditServiceTypeCard(null)}>*/}
                                        {/*        Add Resource Type*/}
                                        {/*    </Button>*/}

                                        {/*</FormActionWithPermissions>*/}
                                    </div>
                                </div>
                                {/*<div className={classes.root}>*/}
                                {/*    {serviceTypes.edges*/}
                                {/*        .map(edge => edge.node)*/}
                                {/*        .filter(Boolean)*/}
                                {/*        .sort((serviceTypeA, serviceTypeB) =>*/}
                                {/*            // sortLexicographically(*/}
                                {/*            //     serviceTypeA.name,*/}
                                {/*            //     serviceTypeB.name,*/}
                                {/*            // ),*/}
                                {/*        )*/}
                                {/*        .filter(s => !s.isDeleted)*/}
                                {/*        .map(srvType => (*/}
                                {/*            <div*/}
                                {/*                className={classes.listItem}*/}
                                {/*                key={`srvType_${srvType.id}`}>*/}
                                {/*                <ResourceTypeItem*/}
                                {/*                    serviceType={srvType}*/}
                                {/*                    onEdit={() =>*/}
                                {/*                        this.showAddEditServiceTypeCard(srvType)*/}
                                {/*                    }*/}
                                {/*                />*/}
                                {/*            </div>*/}
                                {/*        ))}*/}
                                {/*</div>*/}
                            </div>

                            <div className={classes.typesList}>
                                {resourceTypesData.map((rt, key: id) => {
                                    return <div className={classes.listItem}>

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
    createFragmentContainer(ResourceTypes, {
        resourceTypes: graphql`
           fragment ResourceTypes_resourceTypes on ResourceType {
            ID
            Name
           }
        `
    })
    ,
);

