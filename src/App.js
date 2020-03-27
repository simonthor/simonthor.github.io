import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

// TODO: decrease number of imports by creating Page component
import SolarSystem from './pages/solar-system';
import Header from './header';
import Page from './page';
import Test from './pages/test';
//import GameMenu from './pages/games';


export default function App() {
    // Only render header if not front page
    return (
        <Router>
            <Route path='/' render={ ( props ) => ( props.location.pathname !== '/') && <Header/> }/>
            <Switch>
                {/*TODO: make this code shorter*/}
                <Route path='/about'>
                  <Page src='about' image='sun'/>
                </Route>
                <Route path='/tips'>
                    <Page src='tips' image='jupiter'/>
                </Route>
                <Route path='/programming'>
                    <Page src='programming' image='earth'/>
                </Route>
                <Route path='/research'>
                    <Page src='research' image='mars'/>
                </Route>
                <Route path='/news'>
                    <Page src='news' image='saturn'/>
                </Route>
                <Route path='/test'>
                    <Test />
                </Route>
                <Route exact path='/'>
                    <SolarSystem/>
                </Route>
                <Route>
                    <Page src='error'/>
                </Route>
            </Switch>
        </Router>
    );
}
