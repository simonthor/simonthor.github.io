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
        <nav>
              <Link to="/">Home</Link> | <Link to="/solar-system">Solar System</Link>
        </nav>

        <Switch>
          <Route path="/solar-system">
              <SolarSystem />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
