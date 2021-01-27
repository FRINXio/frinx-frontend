import React, {useContext} from "react";
import Typography from "@material-ui/core/Typography";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import {withRouter} from "react-router-dom";
import {GlobalContext} from "../../common/GlobalContext";

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
    const global = useContext(GlobalContext);

    return (
        <div className={classes.wrapper}>
            <Typography variant="h2" gutterBottom>
                <IconButton onClick={() => props.history.push(global.frontendUrlPrefix + '/devices')}>
                    <NavigateBeforeIcon className={classes.icon}/>
                </IconButton>
                {props.title}
            </Typography>
        </div>
    )
};

export default withRouter(DeviceHeader)