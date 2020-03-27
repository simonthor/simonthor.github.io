import planets from '../data/planets.json';
import React from 'react';
import {Link} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';
import ReactTooltip from 'react-tooltip';

const ROTATION_CONSTANT = 0.01;


export default function SolarSystem () {
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
        const width = props['width-rel'] ? props['width-rel'] * props.height : props.height;

        let Container = styled(Link)`
            display: inline-block;
            text-align: center;
            color: white;
            font-size: 1rem;
            height: ${props.height}rem; width: ${width}rem; line-height: ${props.height}rem;
            background-image: url("${require('../images/'+ props.image + '.svg')}");
            background-size: cover;
            
            &:hover {
                animation-play-state: paused;
                font-weight: bold;
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
            Container = styled(Container)`
                position: fixed;
                margin-top: ${-props.height / 2}rem; margin-left: ${-width / 2}rem;
                top: 50%; left: 50%;
                animation: ${orbit} ${orbitPeriod}s linear infinite;
            `;
        }

        this.state = {content: Container, ...props};
    }

    render () {
        const Container = this.state.content;
        return (
            <>
                <ReactTooltip id={this.state.text+"-p"} place="bottom" type="dark" effect="solid"/>
                <Container
                    to={this.state.href} image={this.image}
                    data-for={this.state.text+"-p"} data-tip={this.state.text}
                />
            </>
        );
    }

}
