import axios from 'axios';

    // error handling should be same for all type of requests
    const searchUser = async (email) =>{
        
        try
        {
            const resp=await axios.get( 
                `${process.env.REACT_APP_BACKEND_URL}/users/${email}/`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                      withCredentials: true
                }

            );
            return {
                error: false,
                data:resp.data.data
            };
        }
        catch(err)
        {
            if(err.response)
            {
                const data = err.response.data;
                return {
                    error: true,
                    message:data.message
                }
            }
            else
            {
                if(err.request)
                {
                    return {
                        error: true,
                        message: 'no response from server. contact admin'
                    }
                }
                else
                {
                    return {
                        error: true,
                        message: 'client side error'
                    }
                }
                
            }
        }

    }


    const addAsFriend = async (email) =>{
        
        try
        {
            const resp=await axios.post( 
                `${process.env.REACT_APP_BACKEND_URL}/add_friend/${email}/`,
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
                message:resp.data.message
            };
        }
        catch(err)
        {
            
            if(err.response)
            {
                const data = err.response.data;
                return {
                    error: true,
                    message:data.message
                }
            }
            else
            {
                if(err.request)
                {
                    return {
                        error: true,
                        message: 'no response from server. contact admin'
                    }
                }
                else
                {
                    return {
                        error: true,
                        message: 'client side error'
                    }
                }
                
            }
        }

    }

    const getFriendList = async (email) =>{
        
        try
        {
            const resp=await axios.get( 
                `${process.env.REACT_APP_BACKEND_URL}/friends/`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                      },
                      withCredentials: true
                }

            );
            return {
                error: false,
                data:resp.data.data
            };
        }
        catch(err)
        {
            if(err.response)
            {
                const data = err.response.data;
                return {
                    error: true,
                    message:data.message
                }
            }
            else
            {
                if(err.request)
                {
                    return {
                        error: true,
                        message: 'no response from server. contact admin'
                    }
                }
                else
                {
                    return {
                        error: true,
                        message: 'client side error'
                    }
                }
                
            }
        }

    }


export {searchUser, addAsFriend,getFriendList};