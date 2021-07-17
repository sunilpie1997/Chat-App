import React, {useContext} from "react";
import { Redirect, Route } from "react-router-dom";
import LoadingComponent from "../loading";
import { AuthStateContext } from "./auth-context";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  
    const { user,loading } = useContext(AuthStateContext);
    
    if(loading)
    {
        return (
            <LoadingComponent/>
        )
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