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
    // Paths with same format (Page format) but different contents:
    const pagePaths = [
        {path: '/about', image: 'sun'},
        {path: '/tips', image: 'jupiter'},
        {path: '/programming', image: 'earth'},
        {path: '/research', image: 'mars'},
        {path: '/news', image: 'saturn'},
    ];
    // Only render header if not front page
    return (
        <Router>
            <Route path='/' render={ ( props ) => ( props.location.pathname !== '/') && <Header/> }/>
            <Switch>
                {pagePaths.map((pathInfo) => (
                        <Route path={pathInfo.path}>
                            <Page key={pathInfo.path}
                                  src={pathInfo.path.substring(1)}
                                  image={pathInfo.image}/>
                        </Route>
                    )
                )}
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
