/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {ResourceTypeItem_ResourceType} from './__generated__/ResourceTypeItem_ResourceType.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

// import CommonStrings from '@fbcnms/strings/Strings';
// import ConfigureAccordion from './ConfigureAccordion';
// import DynamicPropertyTypesGrid from '../DynamicPropertyTypesGrid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import React from 'react';
// import RemoveServiceTypeMutation from '../../mutations/RemoveServiceTypeMutation';
// import ServiceEndpointDefinitionStaticTable from './ServiceEndpointDefinitionStaticTable';
// import fbt from 'fbt';
// import withAlert from '@fbcnms/ui/components/Alert/withAlert';
// import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';
import {createFragmentContainer, graphql} from "react-relay";
import Typography from "@material-ui/core/Typography";

type Props = {
  resourceType: ResourceTypeItem_ResourceType,
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
  idContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
  }
};

class ResourceTypeItem extends React.Component<Props> {
  render() {
    const {classes, resourceType, onEdit} = this.props;
    const {ID, Name, PropertyTypes} = resourceType

    console.log('resourceType prop', resourceType)
    return (
      <div>

        <Accordion>
          <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant="h6">{Name}</Typography>
            <div className={classes.idContainer}>
              <Typography variant="caption"> {'(id: ' + ID + ')'} </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.detailsContainer}>
              {PropertyTypes.map((pt) => {
                return <div>
                  Name: {pt.Name} Type: {pt.Type}
                </div>
              })}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }


}

export default withStyles(styles)(createFragmentContainer(ResourceTypeItem, {
  ResourceType: graphql`
    fragment ResourceTypeItem_ResourceType on ResourceType {
      ID
      Name
      PropertyTypes {
        Name
        Type
      }
      Pools {
        ID
        Name
      }
    }
  `
}));
//   withAlert(
//     ResourceTypeItem
//   ),
// );
