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

type PagePath = {
    path: string;
    image: string;
};

const pagePaths: PagePath[] = [
    {path: '/about', image: 'sun'},
    {path: '/tips', image: 'jupiter'},
    {path: '/programming', image: 'earth'},
    {path: '/research', image: 'mars'},
    {path: '/fractals', image: 'saturn'}
];

const ConditionalHeader = () => {
    const location = useLocation();
    return location.pathname !== '/' ? <Header /> : null;
}

const App = () => {
    // Only render header if not front page
    return (
        <>
            <Router>
                <ConditionalHeader/>
                <Routes>
                    {pagePaths.map((pathInfo) => (
                            <Route path={pathInfo.path} key={pathInfo.path + '-r'}
                                element={<Page key={pathInfo.path}
                                      src={pathInfo.path.substring(1)}
                                      image={pathInfo.image}/>} />
                        )
                    )}
                    <Route path='/'
                        element={<SolarSystem/>} />
                    <Route path='*'
                        element={<Page src='error'/>} />
                </Routes>
            </Router>
            <Footer/>
        </>
    );
}

export default App;
