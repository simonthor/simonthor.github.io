import planets from '../data/planets.json';
import React from 'react';
import {Link} from 'react-router-dom';
//import '../styles/solar-system.css';
import styled, {keyframes} from 'styled-components';
//import { CSSTransitionGroup } from 'react-transition-group';
const ROTATION_CONSTANT = 0.1;

export default function SolarSystem (props) {
    return (
        <>
            <h1>Simon Thor</h1>
            {planets.map((planet) =>
                <Planet key={planet.text} {...planet}/>
            )}
        </>
    );
}

// TODO: rewrite planet component so that it does not always have a radius
export class Planet extends React.Component {
    constructor(props) {
        super(props);
        // TODO: better name
        let PlanetDiv = styled.div.attrs({ className: 'Planet'})`
            border-radius: 50%;
            display: inline-block;
            text-align: center;
            color: white;
            font-size: 1rem;
            height: ${props.size}rem; width: ${props.size}rem; line-height: ${props.size}rem;
            background-color: ${props.color};
            &:hover {
                animation-play-state: paused;
                font-weight: bold;
                color: black;
            }
        `;

        if (props.hasOwnProperty('radius')) {
            const radius = Math.floor(props.radius / 100 * Math.min(window.innerWidth, window.innerHeight) / 2);
            // Kepler's law: https://sv.wikipedia.org/wiki/Keplers_lagar
            const orbitPeriod = Math.floor(Math.sqrt(Math.pow(props.radius, 3) * ROTATION_CONSTANT));
            let orbit = keyframes`
                from {
                    transform: rotate(0deg) translateX(${radius}px) rotate(0deg)
                }
                to {
                    transform: rotate(360deg) translateX(${radius}px) rotate(-360deg);
                }
            `;
            //const orbitConfiguration = 'Orbit ' + orbitPeriod + 's linear infinite';
            // TODO: move top and left props to solar system class?
            PlanetDiv = styled(PlanetDiv)`
                position: fixed;
                margin-top: ${(-props.size / 2)}rem; margin-left: ${(-props.size / 2)}rem;
                top: 50%; left: 50%;
                animation: ${orbit} ${orbitPeriod}s linear infinite;
            `;
        }
        /*
        let PlanetLink = (a) => (
            <Link to={props.href} className={a.className}/>
        );
        */
        let PlanetLink = styled(Link)`
            display: block;
            text-decoration: none;
            color: inherit;
        `;

        this.state = {div: PlanetDiv, link:PlanetLink, ...props};
    }

    render () {
        const PlanetDiv = this.state.div;
        const PlanetLink = this.state.link;
        return (
            <PlanetDiv>
                <PlanetLink to={this.state.href}>
                    {this.state.text}
                </PlanetLink>
            </PlanetDiv>
        );
    }

}
        /*// Add the ID of the planet to CSS stylesheet to change its distance from center
        document.styleSheets[1].insertRule(
            '#' + props.text + ' { --radius:' + Math.floor(props.radius/100*Math.min(window.innerWidth, window.innerHeight)/2) + 'px; }',
            document.styleSheets[1].cssRules.length);*/


    // CSS configurations of the planet
    /*const planetStyle = {
        height: planetSize, width: planetSize, lineHeight: planetSize,
        marginTop: (-props.size/2).toString() + 'rem',
        marginLeft:(-props.size/2).toString() + 'rem',
        backgroundColor: props.color,
        Animation: orbitConfiguration, MozAnimation: orbitConfiguration, OAnimation: orbitConfiguration, WebkitAnimation: orbitConfiguration
    };

    const planet = (
            <div className="planet" id={props.text} style={planetStyle}>
                <Link to={props.href}>{props.text}</Link>
            </div>
    );*/
