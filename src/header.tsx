import {Fragment} from 'react';
import type {JSX} from 'react';
import Planet from './components/planet';
import jsonplanets from './data/planets.json';
import type {PlanetData} from './types';

type HeaderPlanet = Omit<PlanetData, 'height'> & {
    height?: number;
};

const planets: HeaderPlanet[] = jsonplanets;

const home: HeaderPlanet = {
    text: 'Home',
    href: '/',
    image: 'favicon'
};

function customizeProps(props: HeaderPlanet): PlanetData {
    // Removes radius and changes size of planets
    const {radius, ...rest} = props;
    return {...rest, height: 2.5};
}

export default function Header(): JSX.Element {
    const headerPlanets: HeaderPlanet[] = [home, ...planets];

    // TODO: add margin directly to planets using styled-components
    return (
        <nav style={{margin: '1rem'}}>
            {headerPlanets.map((planet) => (
                <Fragment key={planet.text + '-f'}>
                    <Planet {...customizeProps(planet)}/>
                    <span style={{marginRight: '1rem'}}/>
                </Fragment>
            ))}
        </nav>
    );
}
