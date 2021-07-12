import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { useStyles } from '../../styles/style';
import { AuthStateContext } from '../authentication/auth-context';
import Box from '@material-ui/core/Box';
import Typography  from '@material-ui/core/Typography';

const Message = (props) => {

    const { user } = useContext(AuthStateContext);

    const classes = useStyles();

    const {id,from,to,content,time} = props.message;
    
    const getClassName = () => {

        if(user.googleId === from)
        return classes.float_left;

        return classes.float_right;
    }
    
    const setDateFormat = (date) =>{

        let chatDate = new Date(date);
        return `${chatDate.getHours()}:${chatDate.getMinutes()}`;
    }


    return (
            <Box className={`${classes.chat_message} ${getClassName()}`}>
                <Paper elevation={3} style={{padding:'1em', minHeight:'20px'}} >
                    {content}
                </Paper>
                <Typography style={{fontSize:"12px",padding:"0.75em"}}>{ setDateFormat(time) }</Typography>
            </Box>
    )
}


export default Message;