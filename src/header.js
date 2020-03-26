import React from 'react';
import {Planet} from "./pages/solar-system";
import jsonplanets from './data/planets.json';
//import styled from 'styled-components';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        let planets = jsonplanets;
        planets.unshift(
            {
                text: "Home",
                short: "🏠",
                href: "/",
                radius: 0,
                size: 7,
                color: "orange"
            }
        );
        this.state = {planets: planets};
    }

    customizeProps (props) {
        // Removes radius and changes size of planets
        const {radius, size, ...rest} = props;
        rest.text = rest.short;
        rest.size = 3;
        return rest;
    };

    render() {
        const planets = this.state.planets;
        // TODO: add margin directly to planets using styled-components
        return (
            <nav>
                {planets.map((planet) => (
                    <React.Fragment key={planet.text + '-f'}>
                        <Planet key={planet.text} {...this.customizeProps(planet)} />
                        <span key={planet.text + '-m'} style={{marginRight: '1rem'}}/>
                    </React.Fragment>
                ))}
            </nav>
        );
    }
}