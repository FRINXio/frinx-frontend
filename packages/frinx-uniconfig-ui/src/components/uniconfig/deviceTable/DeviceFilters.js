import React from 'react'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Search} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

const getOsVersions = (nodes) => {
    return [...new Set(nodes.map(node => node.osVersion))];
};

const DeviceFilters = (props) => {

    return (
        <Grid container spacing={3}>
            <Grid item xs={9}>
                <TextField
                    placeholder="Search devices ( id, host, status, version ... )"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => props.setQuery(e.target.value)}
                    InputProps={{
                        type: 'search', startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    id="combo-box-demo"
                    options={getOsVersions(props.nodes) || []}
                    getOptionLabel={(option) => option}
                    onChange={(e, value) => props.setOsVersion(value)}
                    renderInput={(params) => <TextField {...params} label="OS/version" variant="outlined"/>}
                />
            </Grid>
        </Grid>
    )
};

export default DeviceFilters