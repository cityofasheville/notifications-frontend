import React from 'react';
import { Switch, Route } from 'react-router-dom';
import About from 'app/About';
import Home from 'app/Home';
import Unsubscribe from 'app/Unsubscribe';
import Login from 'template/Login';
import Logout from 'template/Logout';
import 'app/styles/styles.css'; // import your global css here if using


const mainRoutes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/unsubscribe" component={Unsubscribe} />
    <Route component={Home} />
  </Switch>
);

export default mainRoutes;
