// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {

        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
    },
});

type Props = {
    children: React.ChildrenArray<null | React.Element<*>>,
    className?: string,
    value: number,
    index: number,
} & WithStyles<typeof styles>;

const ResourceManagerTab = (props: Props) => {
    const {className, classes, value, index, children} = props;

    return (
        <div className={classes.mainDiv}>
            {value === index && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
};

export default withStyles(styles)(ResourceManagerTab);
