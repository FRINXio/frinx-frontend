/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
// import type {ServiceTypeItem_serviceType} from './__generated__/ServiceTypeItem_serviceType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

// import CommonStrings from '@fbcnms/strings/Strings';
// import ConfigureExpansionPanel from './ConfigureExpansionPanel';
// import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import React from 'react';
// import RemoveServiceTypeMutation from '../../mutations/RemoveServiceTypeMutation';
// import ServiceEndpointDefinitionStaticTable from './ServiceEndpointDefinitionStaticTable';
// import fbt from 'fbt';
// import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {ConnectionHandler} from 'relay-runtime';
// import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';

type Props = {
  serviceType: ServiceTypeItem_serviceType,
  onEdit: () => void,
} & WithAlert &
  WithStyles<typeof styles>;

const styles = {
  detailsContainer: {
    width: '100%',
  },
  section: {
    marginBottom: '24px',
  },
};

class ResourceTypeItem extends React.Component<Props> {
  render() {
    const {classes, serviceType, onEdit} = this.props;
    return (
      <div>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            {/*<ConfigureExpansionPanel*/}
            {/*  entityName="serviceType"*/}
            {/*  icon={<LinearScaleIcon />}*/}
            {/*  name={serviceType.Name}*/}
            {/*  // instanceCount={serviceType.numberOfServices}*/}
            {/*  instanceCount={0}*/}
            {/*  instanceNameSingular="resource"*/}
            {/*  instanceNamePlural="resources"*/}
            {/*  onDelete={this.onDelete}*/}
            {/*  allowDelete={true}*/}
            {/*  onEdit={onEdit}*/}
            {/*/>*/}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={classes.detailsContainer}>
              <div className={classes.section}>
                {/*<DynamicPropertyTypesGrid*/}
                {/*  key={serviceType.ID}*/}
                {/*  propertyTypes={[]}*/}
                {/*  //propertyTypes={serviceType.propertyTypes}*/}
                {/*/>*/}
              </div>
              <div className={classes.section}>
                {/*<ServiceEndpointDefinitionStaticTable*/}
                {/*  serviceEndpointDefinitions={[]}*/}
                {/*  //serviceEndpointDefinitions={serviceType.endpointDefinitions}*/}
                {/*/>*/}
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }

  // onDelete = () => {
  //   this.props
  //     .confirm({
  //       title: <fbt desc="">Delete Service Type?</fbt>,
  //       message: fbt(
  //         'Are you sure you want to delete' +
  //           fbt.param('service name', this.props.serviceType.name) +
  //           "? The service type, and all it's instances will be deleted soon, in the background",
  //         'deletion message',
  //       ),
  //       cancelLabel: CommonStrings.common.cancelButton,
  //       confirmLabel: CommonStrings.common.deleteButton,
  //       skin: 'red',
  //     })
  //     .then(confirm => {
  //       if (!confirm) {
  //         return;
  //       }
  //       RemoveServiceTypeMutation(
  //         {id: this.props.serviceType.id},
  //         {
  //           onError: (error: any) => {
  //             this.props.alert('Error: ' + error.source?.errors[0]?.message);
  //           },
  //         },
  //         store => {
  //           // $FlowFixMe (T62907961) Relay flow types
  //           const rootQuery = store.getRoot();
  //           const serviceTypes = ConnectionHandler.getConnection(
  //             rootQuery,
  //             'ServiceTypes_serviceTypes',
  //           );
  //           ConnectionHandler.deleteNode(
  //             // $FlowFixMe (T62907961) Relay flow types
  //             serviceTypes,
  //             this.props.serviceType.id,
  //           );
  //           // $FlowFixMe (T62907961) Relay flow types
  //           store.delete(this.props.serviceType.id);
  //         },
  //       );
  //     });
  // };
}

export default withStyles(styles)(ResourceTypeItem);
//   withAlert(
//     ResourceTypeItem
//   ),
// );
