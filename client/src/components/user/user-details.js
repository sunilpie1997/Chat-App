import React from 'react';
import Typography from '@material-ui/core/Typography';
import {useStyles} from '../../styles/style';
import Box from '@material-ui/core/Box';


const UserDetails = (props) => {

    const {email, googleId, fullName, photoUrl} = props.user;

    const classes = useStyles();


    return (
        <React.Fragment>

            <Box>
                <img alt={'avatar'} src={photoUrl} className={classes.avatar}/>
            </Box>            
            
                <Typography variant="h6" className={classes.text}>{fullName} </Typography>            
                <Typography variant="body1" className={classes.text}>{email}</Typography>
            
        </React.Fragment>
    )

}

export default UserDetails;