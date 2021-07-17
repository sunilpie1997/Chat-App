import React, {useContext} from "react";
import { Redirect, Route } from "react-router-dom";
import LoadingComponent from "../loading";
import { AuthStateContext } from "./auth-context";

function LoginRoute({ component: Component, ...restOfProps }) {
  
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
                    user ? <Redirect to="/" /> : <Component {...props} />
                }
            />
        );
    }

}

export default LoginRoute;