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
                You can therefore easily find a link to the source code for all my open source projects right besides each respective project title below.
            </p>

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
            <h3>N-body Simulation 3D Visualizer </h3>
            <Repo href="https://github.com/Zigolox/particle-system-simulation"/>
            <p>
                In a university project in thermodynamics, I coded a visualization program for particles interacting with each other through different types of forces.
                The visualizer extracted data from a file, created a 3D animation, and saved it as a video.
                The program focused much on performance by using multi-core processing and <code>numpy</code>.
            </p>

            <h2>Javascript</h2>
            <p><b>Packages:</b> <code>React</code>, <code>React Router</code>, <code>React Tooltips</code>, <code>Styled Components</code></p>
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
            <p>
                A minimalistic Firefox extension which redirects to the front page of a website. <br/>
                Example: <code>https://github.com/simonthor/mainpage &rarr; https://github.com</code>
            </p>

            <h2>MATLAB</h2>
            <p>Packages: <code>irfu-matlab</code></p>
            <h3>Analysis and Visualization of Cluster Satellite Data</h3>
            <p>
                Using the <code>irfu-matlab</code> package to collect data from NASA:s satellite data API.
                I then cleaned, analyzed, and visualized this data with MATLAB.
            </p>

            <h2>C++</h2>
            <p>Packages: <code>Pythia</code></p>
            <h3>Particle physics simulation of quark and gluon Jets</h3>
            <p>
                Using the <code>Pythia</code> module, I simualted collisions in a particle accelerator to generate quark and gluon jets.
                This data was saved and analyzed using Python.
            </p>
            
            <h2>Java</h2>
            <p>Packages: <code>Swing</code></p>
            <h3>Sudoku</h3>
            <p>
                As part of a programming course in 2019, I coded a sudoku game.
                This included an automatic sudoku generator and solver.
                The sudoku generating and solving algorithms could generate boards of any size, e.g. 4x4, 9x9, or 25x25.
            </p>
        </>
    );
}