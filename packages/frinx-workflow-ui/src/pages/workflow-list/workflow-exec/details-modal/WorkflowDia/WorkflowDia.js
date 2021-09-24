// @flow
import Grapher from '../../../../../common/Grapher';
import React, { Component } from 'react';
import Workflow2Graph from '../../../../../common/wfegraph';
import defaultTo from 'lodash/fp/defaultTo';
import { Box, Flex } from '@chakra-ui/react';

class WorkflowDia extends Component {
  constructor(props) {
    super(props);

    this.state = WorkflowDia.getGraphState(props);
  }

  static getGraphState(props) {
    const wfe2graph = new Workflow2Graph();
    const subwfs = defaultTo({})(props.subworkflows);
    const wfe = defaultTo({ tasks: [] })(props.wfe);
    const { edges, vertices } = wfe2graph.convert(wfe, props.meta);
    const subworkflows = {};

    for (const refname in subwfs) {
      const submeta = subwfs[refname].meta;
      const subwfe = subwfs[refname].wfe;
      subworkflows[refname] = wfe2graph.convert(subwfe, submeta);
    }

    return { edges, vertices, subworkflows };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(WorkflowDia.getGraphState(nextProps));
  }

  render() {
    const { edges, vertices, subworkflows } = this.state;

    return (
      <Box overflow="scroll">
        {!this.props.def ? (
          <div>
            <Flex textAlign="center">
              <Box>
                <h2>Execution Flow</h2>
              </Box>
            </Flex>
            <hr />
          </div>
        ) : null}

        <Grapher def={this.props.def} edges={edges} vertices={vertices} layout="TD-auto" innerGraph={subworkflows} />
      </Box>
    );
  }
}

export default WorkflowDia;
