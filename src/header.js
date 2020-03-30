import React from 'react';
import Planet from './components/planet';
import jsonplanets from './data/planets.json';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        const home = {
            text: "Home",
            href: "/",
            radius: 0,
            size: 3,
            image: "favicon"
        };
        this.state = {planets: [home, ...jsonplanets]};
    }

    customizeProps (props) {
        // Removes radius and changes size of planets
        const {radius, ...rest} = props;
        rest.height = 3;
        return rest;
    };

    render() {
        const planets = this.state.planets;
        // TODO: add margin directly to planets using styled-components
        return (
            <nav>
                {planets.map((planet) => (
                    <React.Fragment key={planet.text + '-f'}>
                        <Planet key={planet.text} {...this.customizeProps(planet)} style={{marginRight: '1rem'}}/>
                        <span key={planet.text + '-m'} style={{marginRight: '1rem'}}/>
                    </React.Fragment>
                ))}
            </nav>
        );
    }
}