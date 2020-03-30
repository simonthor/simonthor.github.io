import React from 'react';
import Planet from './components/planet';
import jsonplanets from './data/planets.json';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        const home = {
            text: "Home",
            href: "/",
            image: "favicon"
        };
        this.state = {planets: [home, ...jsonplanets]};
    }

    customizeProps (props) {
        // Removes radius and changes size of planets
        const {radius, ...rest} = props;
        rest.height = 2.5;
        return rest;
    };

    render() {
        const planets = this.state.planets;
        // TODO: add margin directly to planets using styled-components
        return (
            <nav style={{margin: '1rem'}}>
                {planets.map((planet) => (
                    <React.Fragment key={planet.text + '-f'}>
                        <Planet key={planet.text} {...this.customizeProps(planet)}/>
                        <span key={planet.text + '-m'} style={{marginRight: '1rem'}}/>
                    </React.Fragment>
                ))}
            </nav>
        );
    }
}