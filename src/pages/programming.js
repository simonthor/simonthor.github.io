import React from 'react';
import {Link} from 'react-router-dom';
//import styled from 'styled-components';

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
            <p>
                This page lists my experiences and projects with programming in different languages.
                I believe that open source contributes to a better world within coding, which is why most of my projects are open source.
                You can therefore easily find a link to the source code for all my open source projects right besides each respective project title below.</p>
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
            <p>
                An interactive fractal generator where one can choose among multiple different fractals and interact with them by zooming in and out.
            </p>

            <h2>Javascript</h2>
            <p><b>Packages:</b> <code>React</code>, <code>React Router</code>, <code>Styled Components</code>, <code>scipy</code></p>
            <h3>This website</h3>
            <Repo href="https://github.com/simonthor/simonthor.github.io"/>
            <p>
                This website has been made in React, React Router, and Styled Components.
                Images on the website such as planets are also designed by me.
                Besides information about me, the website also has an extensive list of summer programs, STEM competitions, and much more for people interested in STEM and programming.
                This list can be found <Link to="/tips">here</Link>.
            </p>
            <h3>Mainpage</h3>
            <Repo href="https://github.com/simonthor/mainpage"/>
            <p style={{marginBottom: 0}}>
                A minimalistic Firefox extension which redirects to the front page of a website.
                Example: <code>https://github.com/simonthor/mainpage</code> &rarr; <code>https://github.com</code>
            </p>
        </>
    );
}