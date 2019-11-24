
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import React, {Component} from 'react';
import Authentication from '../utils/Authentication';
import Homepage from '../pages/homepage/Homepage';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Dashboard from '../pages/dashboard/Dashboard';


function UnLoggedInRoute ({component: Component, loggedIn, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => loggedIn === false
          ? <Component {...props} />
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
      />
    )
}

function LoggedInRoute ({component: Component, loggedIn, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => loggedIn === true
          ? <Component {...props} />
          : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
      />
    )
}

class RouterCheck extends Component{
    constructor(props){
        super(props);
        this.state = {
            loggedIn:  Authentication.isLoggedIn(),
        }
    }

    render(){
        return (
        <Router>
            <div>
                <Route exact path="/" component={Homepage}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <LoggedInRoute loggedIn = {this.state.loggedIn} path="/dashboard" component={Dashboard}/>
            </div>
        </Router>
        
        );
    }
}

export default RouterCheck;