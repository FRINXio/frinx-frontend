// eslint-disable-next-line flowtype/no-types-missing-file-annotation
import type { WithStyles } from '@material-ui/core';

import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

const styles = () => ({
  root: {

    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  mainDiv: {
    padding: '24px 0px',
  },
  editor: {
    height: '150px',
    // border: '2px solid grey'
  },
  notCollapsedMainDiv: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gridTemplateRows: '200px',
  },
  heading: {
    // fontSize: 15,

  },
  headingId: {
    color: '#838383',
  },
  codeIconExpanded: {
    color: '#212121',
    backgroundColor: '#fff',
    transition: 'background-color 200ms',
  },
  codeIconNotExpanded: {
    color: '#fff',
    backgroundColor: '#212121',
    borderRadius: '7px',
    transition: 'background-color 200ms',
  },

});

type allocationStrategyItemPropsTypes = {
    id: Number,
    Lang: string,
    Name: string,
    Script: string,
}

type Props = {
    allocationStrategyItemProps: allocationStrategyItemPropsTypes,
} & WithStyles<typeof styles>;

const AllocationStrategiesItem = (props: Props) => {
  const {
    classes, allocationStrategyItemProps,
  } = props;
  const {
    id, Lang, Name, Script,
  } = allocationStrategyItemProps;
  const [editorValue, setEditorValue] = useState(Script);
  // eslint-disable-next-line no-unused-vars
  const [isExpanded, setIsExpanded] = useState(false);

  const onChange = (val) => {
    setEditorValue(val);
  };
  return (
    <div className={classes.mainDiv}>
      <Accordion onChange={(event, expanded) => {
        setIsExpanded(expanded);
      }}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{Name}</Typography>
          <Typography className={classes.headingId}>
            {` ( id: ${id} `}
            )
            {' '}
          </Typography>

        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.notCollapsedMainDiv}>
            <div>
              { `Lang: ${Lang}` }
            </div>
            <div>

              <div>
                <AceEditor
                  className={classes.editor}
                  height="150px"
                  width="100%"
                  mode="javascript"
                  theme="tomorrow"
                  onChange={onChange}
                  name="UNIQUE_ID_OF_DIV"
                  editorProps={{ $blockScrolling: true }}
                  value={editorValue}
                  readOnly
                  fontSize={16}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default withStyles(styles)(AllocationStrategiesItem);
