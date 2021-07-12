import React from 'react';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../../styles/style';
import { Box } from '@material-ui/core';

const FeaturesList = () => {

    const classes = useStyles();

    return (

        <Box style={{marginTop:'2em',textAlign:"left", margin:'1em auto'}}>
            <Typography variant="h6" className={classes.text}>Features</Typography>
            <Typography variant="subtitle1" className={classes.text}>1. Sign in with google</Typography>
            <Typography variant="subtitle1" className={classes.text}>2. Search and add friends</Typography>
            <Typography variant="subtitle1" className={classes.text}>3. Find which of them is online</Typography>
            <Typography variant="subtitle1" className={classes.text}>4. Chat with them</Typography>
        </Box>
    )

}

export default FeaturesList;