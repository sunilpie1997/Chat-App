import axios from 'axios';

    // to send token-id recived from google on signin so that server can maintain session for user
    /*
    returns {
        email : ___,
        fullName : ___,
        photoUrl : ___,
        googleId : ___
    }
    */
    const authenticateUser = async (token) =>{
        
        const bodyParameters = {
           id_token: token
        };
        
        try
        {
            const resp=await axios.post( 
                `${process.env.REACT_APP_BACKEND_URL}/auth/login/`,
                bodyParameters,
                {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    withCredentials: true
                }

            );
            return {
                error: false,
                data:resp.data.user
            };
        }
        catch(err)
        {
            if(err.message === "Network Error")
            {
                return {
                    error: true,
                    message: 'could not connect to backend'
                }
            }
            else
            {
                const data = err.response.data;

                return {
                    error:true,
                    message:data.message
                }
            }
            
        }

    }

    const logoutUser = async () =>{
        
        try
        {
            await axios.post( 
                `${process.env.REACT_APP_BACKEND_URL}/auth/logout/`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                      withCredentials: true
                }

            );
            return {
                error: false,
            };
        }
        catch(err)
        {
            if(err.message === "Network Error")
            {
                return {
                    error: true,
                    message: 'could not connect to backend'
                }
            }
            else
            {
                const data = err.response.data;

                return {
                    error:true,
                    message:data.message
                }
            }
        }

    }

export {authenticateUser, logoutUser};