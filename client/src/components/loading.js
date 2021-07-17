import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';


const LoadingComponent = () => {

    return (
        <Box style={{margin:'auto'}}>
            
            <CircularProgress color="secondary" />

        </Box>
    );
}

export default LoadingComponent;