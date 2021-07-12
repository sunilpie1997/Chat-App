import React, {useContext} from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthStateContext } from "./auth-context";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  
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
                    user ? <Component {...props} /> : <Redirect to="/login" />
                }
            />
        );
    }

}

export default ProtectedRoute;