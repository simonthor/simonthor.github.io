import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

// TODO: decrease number of imports by creating Page component
import SolarSystem from './pages/solar-system';
import Programming from './pages/programming';
import Tips from './pages/tips';
import Research from './pages/research';
import Header from './header';
import About from './pages/about';
import Error from './pages/error';
import Test from './pages/test';
import News from './pages/news';
//import GameMenu from './pages/games';


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
                <Route path='/research'>
                    <Research/>
                </Route>
                <Route path='/test'>
                    <Test/>
                </Route>
                <Route path='/news'>
                    <News/>
                </Route>
                <Route exact path='/'>
                    <SolarSystem/>
                </Route>
                <Route>
                    <Error/>
                </Route>
            </Switch>
        </Router>
    );
}
