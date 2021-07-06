import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { useStyles } from '../../styles/style';
import { AuthContext } from '../authentication/auth-context';

const Message = (props) => {

    const authContext = useContext(AuthContext);
    const user = authContext.loggedInUser.user;

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
        <React.Fragment>
            <Paper elevation={3} className={`${classes.chat_message} ${getClassName()}`}>
                {content}
                { setDateFormat(time) }
            </Paper>
        </React.Fragment>
    )
}


export default Message;