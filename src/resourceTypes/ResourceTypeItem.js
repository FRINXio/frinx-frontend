/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
// eslint-disable-next-line import/no-unresolved
import type { WithAlert } from '@fbcnms/ui/components/Alert/withAlert';
import type { WithStyles } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { createFragmentContainer, graphql } from 'react-relay';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteResourceTypeMutation from '../mutations/DeleteResourceTypeMutation';
// eslint-disable-next-line camelcase
import type { ResourceTypeItem_ResourceType } from './__generated__/ResourceTypeItem_ResourceType.graphql';

type Props = {
  // eslint-disable-next-line camelcase
  ResourceType: ResourceTypeItem_ResourceType,
  // eslint-disable-next-line react/no-unused-prop-types
  onEdit: () => void,
  // eslint-disable-next-line react/no-unused-prop-types
  showEditCard: () => void
} & WithAlert &
  // eslint-disable-next-line no-use-before-define
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
  },
  AccordionSummaryContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
};

class ResourceTypeItem extends React.Component<Props> {
  deleteResourceType = (event, resourceTypeId) => {
    const { showAddEditCard } = this.props;
    event.preventDefault();
    const variables = {
      input: {
        resourceTypeId,
      },
    };

    DeleteResourceTypeMutation(variables);
    console.log(showAddEditCard, this.props);
    showAddEditCard(true);
    showAddEditCard(false);
  }

  render() {
    const {
      classes, ResourceType,
    } = this.props;
    const { id, Name, PropertyTypes } = ResourceType;

    return (
      <div>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <div className={classes.AccordionSummaryContainer}>
              <div>
                <Typography variant="h6">{Name}</Typography>
                <div className={classes.idContainer}>
                  <Typography variant="caption">
                    {' '}
                    {`(id: ${id})`}
                    {' '}
                  </Typography>
                </div>
              </div>
              <div>
                <IconButton color="primary" onClick={(event) => this.deleteResourceType(event, id)}><DeleteOutlinedIcon variant="outlined" /></IconButton>
              </div>
            </div>

          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.detailsContainer}>
              Properties:
              {PropertyTypes.map((pt) => (
                <div style={{ marginLeft: '8px' }}>
                  <b>{pt.Name}</b>
                  {' '}
                  :
                  {pt.Type}
                </div>
              ))}
              Pools:

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
  `,
}));
