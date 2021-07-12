import React, {useContext} from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "./auth-context";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  
    const { user,loading } = useContext(AuthContext).authState;
    
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