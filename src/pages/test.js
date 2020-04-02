import styled from 'styled-components';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import React from 'react';
import SolarSystem, {Planet} from './solar-system';
import ReactTooltip from 'react-tooltip';
import Page from '../components/page';
import jupiter from '../images/jupiter.svg';


export default function Test (props) {
    const Abc = styled.div`
        & p {
            color: red;
        }
    `;

    return (
        <Abc>
            <p>hi</p>
        </Abc>
    );
}

