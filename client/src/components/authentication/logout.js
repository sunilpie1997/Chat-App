import React, {useContext, useState} from 'react';
import { AuthUpdaterContext } from './auth-context';
import { GoogleLogout } from 'react-google-login';
import { logoutUser } from '../../services/login-service';
import Fab from '@material-ui/core/Fab';
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';

const Logout = () => {

    const authDispatch = useContext(AuthUpdaterContext);

    /************** for alerts (success and failure) ***********/
    const [open,setOpen] = useState(false);
    const [message,setMessage] = useState('');
    const [error, setError] = useState(false);
    /************************************************************/            
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };    
    

    const onSuccess = async() => {

        const apiResp = await logoutUser();

        if(!apiResp.error)
        {
            authDispatch({type:'logout'});
        }
        else
        {
            setOpen(true);
            setMessage(apiResp.message);
            setError(true);
        }

    };

    return (
        <React.Fragment>

            {/***************************** alerts on error and success *****************************/}    
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                        {
                            error ? (
                               <AlertMessage onClose={handleClose} severity="error">{message}</AlertMessage>
                            ):
                            (
                                <AlertMessage onClose={handleClose} severity="success">{message}</AlertMessage>
                            )
                        }
                    </Snackbar>
                    
            {/*****************************************************************************************/}

            <GoogleLogout
                clientId={process.env.REACT_APP_CLIENT_ID}
                onLogoutSuccess={onSuccess}
                buttonText="Logout"
                render={renderProps => (
                    <Fab variant="extended" color="secondary" onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</Fab>
                  )}
            />
            
        </React.Fragment>
    );

}

export default Logout;