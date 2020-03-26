import React from 'react';
import {Planet} from "./pages/solar-system";
import jsonplanets from './data/planets.json';
import styled from 'styled-components';

export class Tooltip extends React.Component {
    //TODO: center text below icon
    constructor(props) {
        super(props);
        const Tooltiptext = <span className="tooltiptext">{props.text}</span>;
        const T = styled.div`
        position: relative;
        display: inline-block;
        /* Tooltip text */
        & .tooltiptext {
            visibility: hidden;
            color: inherit;
            text-align: center;
            position: absolute;
        }
        
        /* Show the tooltip text when you mouse over the tooltip container */
        &:hover .tooltiptext {
            position: absolute;
            top: 100%;
            left: 0;
            /*margin-left: -{parseInt(Tooltiptext.current.offsetWidth.substring(0, Tooltiptext.current.offsetWidth.length-2))/2 + 'px'};*/
            visibility: visible;
            z-index: 1;
        }
        `;
        this.state = {T, Tooltiptext, ...props}
        }

    render() {
        const T = this.state.T;
        return (
            <T>
                {this.state.children}
                {this.state.Tooltiptext}
            </T>
        );
    }
}

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
        // TODO: add tooltip
        return (
            <nav>
                {planets.map((planet) => (
                    <React.Fragment key={planet.text + '-f'}>
                        <Tooltip text={planet.text}>
                            <Planet key={planet.text} {...this.customizeProps(planet)} style={{marginRight: '1rem'}}/>
                        </Tooltip>
                        <span key={planet.text + '-m'} style={{marginRight: '1rem'}}/>
                    </React.Fragment>
                ))}
            </nav>
        );
    }
}