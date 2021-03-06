require('./js/Utilities.js')
require('./js/Message.js')
require('./js/Login.js')
require('./js/SignUp.js')
require('./sass/styles.scss')

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import About from './modules/pages/About'
import Repos from './modules/pages/Repos'
import Repo from './modules/pages/Repo'
import Home from './modules/pages/Home'
import Message from './modules/pages/Message'
import AdminPage from './modules/pages/AdminPage'
import Login from './modules/utility-components/Login'
import SignUp from './modules/utility-components/SignUp'


var routeChangeHandler = function(previousRoute, nextRoute){
  console.log("Route Changed")
  console.log(previousRoute)
  console.log(nextRoute)
}

render((
  <Router history={browserHistory}>
    <Route path="/" onChange={routeChangeHandler} component={App}>
      <IndexRoute component={Home} />
      <Route path="/repos" component={Repos}>
        <Route path="/repos/:userName/:repoName" component={Repo} />
      </Route>
      <Route path="/about" component={About} />
      <Route path="/message" component={Message} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/admin" component={AdminPage} />
    </Route>
  </Router>
), document.getElementById('app'))