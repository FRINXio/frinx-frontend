import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RefreshIcon from '@material-ui/icons/Refresh';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
    btnContainer: {
        marginLeft: "20px",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    },
    buttons: {
        margin: theme.spacing(0.5),
    },
    wrapper: {
        display: "flex",
        alignItems: "center"
    }
}));

const DeviceListHeader = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.wrapper}>
            <Typography variant="h2" gutterBottom>
                {props.title}
            </Typography>
            <div className={classes.btnContainer}>
                <div>
                    <Badge badgeContent={props.checked.length === 1 ? `as ${props.checked[0]?.nodeId}` : null}
                           anchorOrigin={{
                               vertical: 'bottom',
                               horizontal: 'left'
                           }} overlap="circle" color="secondary">
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.buttons}
                            startIcon={<AddIcon/>}
                            onClick={props.mountNode}
                        >
                            Mount
                        </Button>
                    </Badge>
                    <Badge badgeContent={props.checked.length} color="primary">
                        <Button
                            variant="outlined"
                            color="secondary"
                            className={classes.buttons}
                            disabled={props.checked.length === 0}
                            onClick={props.unmountNodes}
                        >
                            Unmount
                        </Button>
                    </Badge>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        className={classes.buttons}
                        startIcon={<RefreshIcon/>}
                        onClick={props.fetchData}
                    >
                        Refresh Devices
                    </Button>
                </div>
            </div>
        </div>
    )
};

export default DeviceListHeader