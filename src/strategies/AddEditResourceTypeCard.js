// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import AceEditor from 'react-ace';

import {motion} from 'framer-motion';
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import CodeEditor from "../configure/CodeEditor";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";
import {createAllocationStrat, fetchQuery} from "../queries/Queries";
import {createFragmentContainer, graphql} from "react-relay";
import AddResourceTypeMutation from "../mutations/AddResourceTypeMutation";

const styles = theme => ({
    card: {
        padding: '24px',
        margin: '24px',
    },
    nameTextField: {
        maxWidth: '120px',
        marginBottom: '24px'
    }
});

type Props = {
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
} & WithStyles<typeof styles>;

const AddEditResourceTypeCard = (props: Props) => {
    const {className, classes} = props;

    const [name, setName] = useState('');

    const onNameChanged = (val) => {
        setName(val.target.value)
    }

    const addNewResourceType = () => {
        AddResourceTypeMutation('Through Mutation2', {
            vlan: "int"
        })
    };

    return (
        <div>
            <div><Button onClick={addNewResourceType}>Commit</Button></div>
            <Card className={classes.card}>
                <TextField label="NAME" onChange={onNameChanged} className={classes.nameTextField} />
            </Card>
            <div>
                <Typography>Properties</Typography>
            </div>

            <Card className={classes.card}>
                <div>
                    <div>
                        <Select></Select>
                    </div>
                    <div>

                    </div>

                </div>
            </Card>
            <div>
                {/*<Button onClick={createStrategy}>Save</Button>*/}
            </div>
        </div>
    );
};

export default withStyles(styles)(createFragmentContainer(AddEditResourceTypeCard, {
    editingResourceType: graphql`
        fragment AddEditResourceTypeCard_editingResourceType on ResourceType {
            ID
            Name
            PropertyTypes {
                ID
                Name
                Type
                IntVal
                StringVal
                FloatVal
                Mandatory
            }
        }
    `,
}));
