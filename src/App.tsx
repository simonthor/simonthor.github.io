import React from 'react';
import './styles/index.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation
} from 'react-router-dom';

import SolarSystem from './pages/solar-system';
import Header from './header';
import Footer from './footer';
import Page from './components/page';

function ConditionalHeader() {
    const location = useLocation();
    return location.pathname !== '/' ? <Header /> : null;
}

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
            {path: '/fractals', image: 'saturn'}
        ];
    }

    render() {
        // Only render header if not front page
        return (
            <>
                <Router>
                    <ConditionalHeader/>
                    <Routes>
                        {this.pagePaths.map((pathInfo) => (
                                <Route path={pathInfo.path} key={pathInfo.path + "-r"}
                                    element={<Page key={pathInfo.path}
                                          src={pathInfo.path.substring(1)}
                                          image={pathInfo.image}/>}
                                />
                            )
                        )}
                        <Route exact path='/'
                            element={<SolarSystem/>}
                        />
                        <Route path='*'
                            element={<Page src='error'/>}
                        />
                    </Routes>
                </Router>
                <Footer/>
            </>
        );
    }

}
