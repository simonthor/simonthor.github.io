import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
//import styled from 'styled-components';

import SolarSystem from './pages/solar-system';
import Header from './header';
import Footer from './footer';
import Page from './components/page';
// While Test can be rendered using Page, it should not depend on bugs in Page itself.
// Hence its standalone import
import Test from './test';
//import GameMenu from './pages/games';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        // TODO: this object should not be hard coded but instead loaded from data/planets.json
        // Paths with same format (Page format) but different contents:
        this.pagePaths = [
            {path: '/about', image: 'sun'},
            {path: '/tips', image: 'jupiter'},
            {path: '/programming', image: 'earth'},
            {path: '/research', image: 'mars'},
            {path: '/games', image: 'saturn'}
        ];
    }

    render() {
        // Only render header if not front page
        return (
            <>
                <Router>
                    <Route path='/' render={ ( props ) => ( props.location.pathname !== '/') && <Header key="header"/> }/>
                    <Switch>
                        {this.pagePaths.map((pathInfo) => (
                                <Route path={pathInfo.path} key={pathInfo.path + "-r"}>
                                    <Page key={pathInfo.path}
                                          src={pathInfo.path.substring(1)}
                                          image={pathInfo.image}/>
                                </Route>
                            )
                        )}
                        <Route path='/test'>
                            <Test/>
                        </Route>
                        <Route exact path='/'>
                            <SolarSystem/>
                        </Route>
                        <Route>
                            <Page src='error'/>
                        </Route>
                    </Switch>
                </Router>
                <Footer/>
            </>
        );
    }

}
