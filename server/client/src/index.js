import React from 'react';
import ReactDOM from 'react-dom';
import './custom.css';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, BrowserRouter } from 'react-router-dom'



import Register from './components/register';
import Home from './components/home';
import Game from './components/game';
import StartPage from './components/startpage';
import {ProtectedRoute} from './components/protected.route'


function App() {
  return(
    <div className="App">
    <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/register" component={Register} />
    <ProtectedRoute exact path="/startpage" component={StartPage} />
    <ProtectedRoute exact path="/gametable" component={Game} /> 
    <Route path ='*' component={() => "404 NOT FOUND"}/>
    </Switch>
    </div>
  );
}


/* const routing = (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={Register} />
        <Route path="/gametable" component={Game} />        
        
      </div>
    </Router>
  ) */
  ReactDOM.render(<BrowserRouter><App/></BrowserRouter>, document.getElementById('root'))


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
