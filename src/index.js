import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {SolarSystem} from './pages/solar-system.js';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
              <SolarSystem />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
