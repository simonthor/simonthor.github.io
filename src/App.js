import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import SolarSystem from './pages/solar-system';
import Programming from './pages/programming';
import Tips from './pages/tips';
import Physics from './pages/physics';
//import GameMenu from './pages/games';
import Header from './header';
import About from './pages/about';


export default function App() {
    // Only render header if not front page
    return (
        <Router>
            <Route path='/' render={ ( props ) => ( props.location.pathname !== '/') && <Header/> }/>
            <Switch>
                <Route path='/about'>
                  <About/>
                </Route>
                <Route path='/tips'>
                    <Tips/>
                </Route>
                <Route path='/programming'>
                    <Programming/>
                </Route>
                <Route path='/physics'>
                    <Physics/>
                </Route>
                <Route path='/'>
                    <SolarSystem/>
                </Route>
            </Switch>
        </Router>
    );
}
