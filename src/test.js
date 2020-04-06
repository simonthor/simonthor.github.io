import styled from 'styled-components';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import React from 'react';
import SolarSystem, {Planet} from './pages/solar-system';
import ReactTooltip from 'react-tooltip';
import Collapsible from './components/collapsible';

function RefLink (props) {
    console.log(props.children);
    return (
        <div>
            <p>{props.children}</p>
        </div>

    )
}

export default function Test (props) {

    return (
        <RefLink>
            hej
        </RefLink>
    );
}

