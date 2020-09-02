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

const styles = theme => ({
});

type Props = {
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
} & WithStyles<typeof styles>;

const AddEditResourceTypeCard = (props: Props) => {
    const {className, classes} = props;

    return (
        <Card>
            now showing just card
        </Card>
    );
};

export default withStyles(styles)(AddEditResourceTypeCard);
