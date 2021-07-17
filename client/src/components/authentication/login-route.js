import React, {useContext} from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthStateContext } from "./auth-context";

function LoginRoute({ component: Component, ...restOfProps }) {
  
    const { user,loading } = useContext(AuthStateContext);
    
    if(loading)
    {
        return <h1>Loading</h1>
    }
    else
    {
        return (
            <Route
                {...restOfProps}
        
                render={ props =>
                    user ? <Redirect to="/" /> : <Component {...props} />
                }
            />
        );
    }

}

export default LoginRoute;