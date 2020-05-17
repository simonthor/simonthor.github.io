import styled from 'styled-components';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import React from 'react';

function RefLink (props) {
    console.log(props.children);
    return (
        <div>
            <p>{props.children}</p>
        </div>

    )
}

export default function Test (props) {
    const A = styled('div')`
        border: red;
    `;
    return (
        <A>
            <p>hi</p>
        </A>
    );
}

