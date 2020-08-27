import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Accordion from "@material-ui/core/Accordion";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import {useEffect, useState} from "react";
import {motion} from "framer-motion"
import * as axios from "axios";
import {graphql} from "graphql";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CodeIcon from '@material-ui/icons/Code'


import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"

const iconWidth = 40
const iconHeight = 40

const styles = theme => ({
    root: {
        color: theme.palette.grey[900],
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
    },
    mainDiv: {
        padding: '24px'
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
        //fontSize: 15,

    },
    headingId: {
        color: '#838383'
    },
    codeIconExpanded: {
        color: '#212121',
        backgroundColor: '#fff',
        transition: 'background-color 200ms'
    },
    codeIconNotExpanded: {
        color: '#fff',
        backgroundColor: '#212121',
        borderRadius: '7px',
        transition: 'background-color 200ms'
    }

});

type allocationStrategyItemProps = {
    id: Number,
    Lang: string,
    Name: string,
    Script: string,
}

type Props = {
    allocationStrategyItemProps: allocationStrategyItemProps,
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
} & WithStyles<typeof styles>;

const AllocationStrategiesItem = (props: Props) => {
    const {className, classes, children, allocationStrategyItemProps} = props;
    const {id, Lang, Name, Script} = allocationStrategyItemProps
    const [editorValue, setEditorValue] = useState(Script);
    const [isExpanded, setIsExpanded] = useState(false)

    const onChange = (val) => {
        setEditorValue(val)
        console.log(val, editorValue);
    }

    const deleteAllocationStrategyQuery = `query queryAllocationStrats {
        QueryAllocationStrategies{
            ID
            Name
            Lang
            Script
        }
    }
    `

    function fetchQuery(query) {

        return axios
            .post('http://localhost:8884/query', {
                query: query,
            }, { headers: {
                    "x-auth-organization": "FRINX",
                    "x-auth-user-role": "OWNER",
                    "x-auth-user-email": "user@frinx.io"
                } })
            .then(response => {
                return response.data;
            });
    }

    const deleteAllocationStrategy = () => {
        fetchQuery(deleteAllocationStrategyQuery).then(() => {

        })
    }

    return (
        <div className={classes.mainDiv}>
            <Accordion onChange={(event, expanded) => {
                setIsExpanded(expanded)
            } }>
                <AccordionSummary
                    expandIcon={<CodeIcon className={isExpanded ? (classes.codeIconNotExpanded) : classes.codeIconExpanded}/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{Name}</Typography>
                    <Typography className={classes.headingId}>{' ( id: ' + id + ' '}) </Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.notCollapsedMainDiv}>
                        <div></div>
                        <div>
                            <div>
                                { 'Lang: ' + Lang }
                            </div>
                            <div>
                                <AceEditor
                                    className={classes.editor}
                                    height={'150px'}
                                    width={'100%'}
                                    mode="javascript"
                                    theme="tomorrow"
                                    onChange={onChange}
                                    name="UNIQUE_ID_OF_DIV"
                                    editorProps={{$blockScrolling: true}}
                                    value={editorValue}
                                    readOnly={false}
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
