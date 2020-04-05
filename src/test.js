import styled from 'styled-components';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import React from 'react';
import SolarSystem, {Planet} from './pages/solar-system';
import ReactTooltip from 'react-tooltip';
import Collapsible from './components/collapsible';

export default function Test (props) {

    return (
        <Collapsible title='click me'>
            <p>hi</p>
        </Collapsible>
    );
}

