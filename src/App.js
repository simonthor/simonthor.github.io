import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import styled from 'styled-components';

import SolarSystem from './pages/solar-system';
import Header from './header';
import Page from './page';
// While test can be rendered using Page, it should not depend on bugs in Page itself.
// Hence its standalone import
import Test from './pages/test';
//import GameMenu from './pages/games';


export default class App extends React.Component {
    constructor(props) {
        super(props);
        // Paths with same format (Page format) but different contents:
        const pagePaths = [
            {path: '/about', image: 'sun'},
            {path: '/tips', image: 'jupiter'},
            {path: '/programming', image: 'earth'},
            {path: '/research', image: 'mars'},
            {path: '/news', image: 'saturn'},
        ];
        const footer = styled.p`
            position: fixed;
            bottom: 0;
            right: 0;
            font-size: 0.8rem;
        `;

        this.state = {pagePaths: pagePaths, footer: footer};
    }

    render() {
        // Only render header if not front page
        return (
            <>
                <Router>
                    <Route path='/' render={ ( props ) => ( props.location.pathname !== '/') && <Header/> }/>
                    <Switch>
                        {this.state.pagePaths.map((pathInfo) => (
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
                <this.state.footer>&copy; Simon Thor 2020</this.state.footer>
            </>
        );
    }

}
