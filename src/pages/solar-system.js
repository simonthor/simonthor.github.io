import planets from '../data/planets.json';
import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/solar-system.css';
//import { CSSTransitionGroup } from 'react-transition-group';
const ROTATION_CONSTANT = 0.1;

export function SolarSystem (props) {
    return (
        <>
            <h1>Simon Thor</h1>
            {planets.map((planet) =>
                <Planet key={planet.text} {...planet}/>
            )}
        </>
    );
}

function Planet (props) {
    // Kepler's law: https://sv.wikipedia.org/wiki/Keplers_lagar
    const orbitPeriod = Math.floor(Math.sqrt(Math.pow(props.radius, 3) * ROTATION_CONSTANT));
    const orbitConfiguration = 'Orbit ' + orbitPeriod + 's linear infinite';
    const planetSize = props.size.toString() + 'rem';

    // CSS configurations of the planet
    const planetStyle = {
        height: planetSize, width: planetSize, lineHeight: planetSize,
        marginTop: (-props.size/2).toString() + 'rem',
        marginLeft:(-props.size/2).toString() + 'rem',
        backgroundColor: props.color,
        Animation: orbitConfiguration, MozAnimation: orbitConfiguration, OAnimation: orbitConfiguration, WebkitAnimation: orbitConfiguration
    };
    // Add the ID of the planet to CSS stylesheet to change its distance from center
    document.styleSheets[1].insertRule(
        '#' + props.text + ' { --radius:' + Math.floor(props.radius/100*Math.min(window.innerWidth, window.innerHeight)/2) + 'px; }',
        document.styleSheets[1].cssRules.length);

    const planet = (
            <div className="planet" id={props.text} style={planetStyle}>
                <Link to={props.href}>{props.text}</Link>
            </div>
    );

    return (planet);
}
