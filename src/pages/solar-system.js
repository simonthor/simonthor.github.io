import planets from '../data/planets.json';
import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/solar-system.css';
//import { CSSTransitionGroup } from 'react-transition-group';
const ROTATION_CONSTANT = 0.001;

export class SolarSystem extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            planets: planets
        };
    }

    render() {
        return (
            this.state.planets.map((planet) =>
            <Planet key={planet.text} {...planet}>
                {planet.text}
            </Planet>
            )
        );
    }
}

function Planet (props) {
    // Kepler's law: https://sv.wikipedia.org/wiki/Keplers_lagar
    const orbitPeriod = Math.floor(Math.sqrt(Math.pow(props.radius, 3) * ROTATION_CONSTANT));
    const orbitConfiguration = 'Orbit ' + orbitPeriod + 's linear infinite';
    const planetSize = props.size.toString() + 'px';

    // CSS confgurations of the planet
    const planetStyle = {
        height: planetSize, width: planetSize, lineHeight: planetSize,
        marginTop: (-props.size/2).toString() + 'px',
        marginLeft:(-props.size/2).toString() + 'px',
        backgroundColor: props.color,
        Animation: orbitConfiguration, MozAnimation: orbitConfiguration, OAnimation: orbitConfiguration, WebkitAnimation: orbitConfiguration
    };
    // Add the ID of the planet to CSS stylesheet to change its distance from center
    document.styleSheets[1].insertRule('#' + props.text + ' { --radius:' + props.radius + 'px; }', 1);

    const planet = (
            <div className="planet" id={props.text} style={planetStyle}>
                <Link to={props.href}>{props.text}</Link>
            </div>
    );

    return (planet);
}
