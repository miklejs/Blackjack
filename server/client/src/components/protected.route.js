import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie';
export const ProtectedRoute = ({component: Component, ...rest}) => {
    return (
        <Route 
        {...rest} 
        render = {(props) => {
            //console.log("auth.isAuthenticated()  ", auth.isAuthenticated())
            if (Cookies.get('auth')) {
                return <Component {...props}/>
            }
            else {
                return <Redirect to={
                    {
                        pathname: '/',
                        state: {
                            from: props.location
                        }
                    }
                }/>
            }
                
            }
        }/>
    )
}