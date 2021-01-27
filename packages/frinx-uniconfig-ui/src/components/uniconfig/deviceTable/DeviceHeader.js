import React from "react";
import Typography from "@material-ui/core/Typography";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import {useRouteMatch, useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: "flex",
        alignItems: "center"
    },
    icon: {
        height: "50px",
        width: "50px"
    }
}));

const DeviceHeader = (props) => {
    const classes = useStyles();
    let history = useHistory()
    let { path } = useRouteMatch();

    return (
        <div className={classes.wrapper}>
            <Typography variant="h2" gutterBottom>
                <IconButton onClick={() => history.push('/uniconfig/devices')}> 
                    <NavigateBeforeIcon className={classes.icon}/>
                </IconButton>
                {props.title}
            </Typography>
        </div>
    )
};

export default DeviceHeader