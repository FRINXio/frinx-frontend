import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {withRouter} from 'react-router-dom';
import {Route} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import withStyles from "@material-ui/core/styles/withStyles";
import {emphasize} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import HomeIcon from '@material-ui/icons/Home';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";

const StyledBreadcrumb = withStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300],
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12),
        },
    },
}))(Chip);

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: "30px",
        marginBottom: "15px"
    }
}));

const Breadcrumb = (props) => {
    const classes = useStyles();

    const handleRoute = (path) => {
        props.history.push(path);
    };

    return (
        <Container className={classes.container}>
            <Route>
                {({location}) => {
                    const pathnames = location.pathname.split('/').filter(x => x);
                    return (
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small"/>}
                                onClick={() => handleRoute('/')}
                            />
                            {pathnames.map((value, index) => {
                                const last = index === pathnames.length - 1;
                                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                                if (value === "ui") return;

                                return (
                                    last ? <Typography key={index} color="textPrimary">{value}</Typography>
                                        :
                                        <Link key={index} color="inherit" href="#" onClick={() => handleRoute(to)}>{value}</Link>
                                );
                            })}
                        </Breadcrumbs>
                    );
                }}
            </Route>
        </Container>
    )
};

export default withRouter(Breadcrumb)
