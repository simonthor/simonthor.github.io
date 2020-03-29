import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

function Repo(props) {
    // TODO: make this look better
    return (
        <a href={props.href}>
            code
        </a>
    )
}

export default function Programming() {
    return (
        <>
            <h1>My Programming Experience</h1>
            <p>This page lists my experiences and projects with programming in different languages.</p>
            <h2>Python</h2>
            <p><b>Packages:</b> <code>numpy</code>, <code>matplotlib</code>, <code>pandas</code>, <code>scipy</code></p>
            <h3>Data Analysis and Visualization of Flux Transfer Events</h3>
            <p>
                A space physics research project conducted at KTH Royal Institute of Technology using Python.
                More information can be found <Link to="/research#fte">here</Link>.
            </p>
            <h3>Data Analysis and Visualization of Quark and Gluon Jets</h3>
            <p>
                A particle physics research project conducted at Massachusetts Institute of Technology.
                More information can be found <Link to="/research#jet">here</Link>.
            </p>
            <h3>Fractal Generator </h3>
            <Repo href="https://github.com/simonthor/fractals"/>
            <p>An interactive fractal generator where one can choose among multiple </p>
            <h2>Javascript</h2>
            <p><b>Packages:</b> <code>React</code>, <code>React Router</code>, <code>Styled Components</code>, <code>scipy</code></p>
            <h3>This website</h3>
            <Repo href="https://github.com/simonthor/simonthor.github.io"/>
            <p> This website has been made in React. All images</p>
        </>
    );
}