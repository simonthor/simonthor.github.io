import planets from '../data/planets.json';
import React from 'react';
import {Link} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import jupiter from '../images/jupiter.svg';

const ROTATION_CONSTANT = 0.1;

// TODO: import images dynamically
// TODO: make tooltip a built-in feature for planets

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

export class Planet extends React.Component {
    constructor(props) {
        super(props);
        // TODO: better name
        let PlanetDiv = styled.div`
            /*border-radius: 50%;*/
            display: block;
            text-align: center;
            color: white;
            font-size: 1rem;
            height: ${props.size}rem; width: ${props.size}rem; line-height: ${props.size}rem;
            background-image: url("${jupiter}");
            background-size: cover;
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
            PlanetDiv = styled(PlanetDiv)`
                position: fixed;
                margin-top: ${(-props.size / 2)}rem; margin-left: ${(-props.size / 2)}rem;
                top: 50%; left: 50%;
                animation: ${orbit} ${orbitPeriod}s linear infinite;
            `;
        }

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
            <PlanetDiv image={this.image}>
                <PlanetLink to={this.state.href}>
                    {this.state.short}
                </PlanetLink>
            </PlanetDiv>
        );
    }

}
