import React, { useContext, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from './auth-context';
import {authenticateUser} from '../../services/login-service';
import Fab from '@material-ui/core/Fab';
import AlertMessage from '../../utils/alerts';
import Snackbar from '@material-ui/core/Snackbar';

const Login = () => {

    const authDispatch = useContext(AuthContext).authDispatch;

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
    
    // on successull signIn with google
    const onSuccess = async (resp) => {

        console.log("google login success");
        const apiResp = await sendIdToken(resp.tokenId);
        if(!apiResp.error)
        {
            console.log("success response from backend");
            console.log("response is", apiResp);

            localStorage.clear();
            // set logged in user (userState)
            authDispatch({type: 'login', value: apiResp.data});
            window.location.pathname="/";

            // no point to use alert as it will not be shown as 'Login' component will be unmounted
        }
        else
        {
            setOpen(true);
            setMessage(apiResp.message);
            setError(true);
            console.log("failure response from backend");
        }
    };

    const onFailure = (resp) => {

        console.log("google login failure",resp);
        localStorage.clear();
        
        setOpen(true);
        setMessage("sign in with google failed");
        setError(true);
    };


    const sendIdToken = async (token) => {

        return await authenticateUser(token);
    }

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

            <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    render={renderProps => (
                        <Fab variant="extended" color="secondary" onClick={renderProps.onClick} disabled={renderProps.disabled}>Sign in with google</Fab>
                      )}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            
        </React.Fragment>

        
    );

}

export default Login;