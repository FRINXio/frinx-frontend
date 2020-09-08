// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';

import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import CodeEditor from "../configure/CodeEditor";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";
import {createAllocationStrat, fetchQuery, createNewResourceType} from "../queries/Queries";
import {createFragmentContainer, graphql} from "react-relay";
import AddResourceTypeMutation from "../mutations/AddResourceTypeMutation";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
    card: {
        padding: '24px',
        margin: '24px',
    },
    nameTextField: {
        maxWidth: '120px',
    },
    propertyContainer: {
        display: 'grid',
        gridTemplateColumns: 'minmax(120px, 1fr)',
        gridTemplateRows: 'repeat(auto-fill, 80px)'
    },
    propertyRow: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    selectContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    select: {
        width: '100px',
        marginLeft: '32px'
    },
    addNewButton: {
        width: '50px'
    }
});

type Props = {
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
    showAddEditCardFunc: Function,
} & WithStyles<typeof styles>;

const AddEditResourceTypeCard = (props: Props) => {
    const {className, classes, showAddEditCardFunc} = props;

    const [name, setName] = useState('');
    const [properties, setProperties] = useState([{type: '', value: ''}]);

    const onNameChanged = (val) => {
        setName(val.target.value)
    }

    const addNewResourceType = () => {
        AddResourceTypeMutation(name, {
            vlan: "int",
        })

        const tmp = {}
        properties.map((prop) => {
            tmp[prop.value] = prop.type
            return prop
        })
        console.log(tmp);

        fetchQuery(createNewResourceType(name, tmp)).then(val => {
            console.log(val)
            showAddEditCardFunc(false)
        });
    };

    const addProperty = () => {
        setProperties([...properties, {type: '', value: ''}])
    }

    const onTypeSelected = (val, index) => {
        const tmp = properties;
        tmp[index].type = val.target.value
        setProperties(tmp);
    }

    const onPropValueChanged = (val, index) => {
        const tmp = properties;
        tmp[index].value = val.target.value
        setProperties(tmp);
    }

    return (
        <div>
            <Card className={classes.card}>
                <TextField label="NAME" onChange={onNameChanged} className={classes.nameTextField} autoFocus={true}/>
            </Card>
            <div>
                <Typography>Properties</Typography>
            </div>

            <Card className={classes.card}>
                <div className={classes.propertyContainer}>
                    {properties.map((p, index) => {
                        return <div className={classes.propertyRow}>
                            <div>
                                <TextField
                                    label="VALUE"
                                    onChange={(val) => onPropValueChanged(val, index)}
                                    className={classes.nameTextField} />
                            </div>
                            <div className={classes.selectContainer}>
                                <Select
                                    onClick={(val) => onTypeSelected(val, index)}
                                    className={classes.select}
                                >
                                    <MenuItem value={'int'}>Int</MenuItem>
                                    <MenuItem value={'string'}>String</MenuItem>
                                </Select>
                            </div>
                            {(index === properties.length - 1) ? <IconButton
                                color="primary"
                                onClick={() => {addProperty()}}
                                className={classes.addNewButton}
                            ><AddIcon /></IconButton> : null}
                            
                        </div>
                    })}
                </div>
            </Card>
            <div><Button variant="contained"
                                        color="primary" onClick={addNewResourceType}>Save</Button></div>
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
