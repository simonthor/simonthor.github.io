import React from 'react';

// TODO: merge Repo and RefLink into one component
function RefLink (props) {
    return (
        <a href={props.href}>
            {props.children}
        </a>
    );
}

export default function Research() {
    return (
        <>
            <h1>My Research Experience</h1>
            <p>
                This page lists my research projects and the activities related to its research.
                When possible, I have linked to a scientific paper that I have co-authored or equivalent.
            </p>
            <h2>The Difference Between Isolated Flux Transfer Events and Flux Transfer Event Cascades</h2>
            <RefLink href="https://doi.org/10.1029/2019JA026629">Paper</RefLink>
            <p>
                During 2017 - 2019, I worked at the department of space and plasma physics at KTH Royal Institute of Technology and conducted research about flux transfer events.
                Using <code>Python</code>, I analyzed and visualized data from the Cluster satellites and OMNI data.
                These results were published in the <i>Journal of Geophysical Research - Space Physics</i> in 2019, and I became one of the youngest in Sweden to ever publish a scientific paper.
                I also presented at two poster sessions: the Swedish national high school science fair (where I proceeded to the final),
                and the "Svenska Rymdforskares Samarbetsgrupp" conference (a conference for space researchers in Sweden), both in 2019.
            </p>
            <h2>Debunking Quark and Gluon Jet Definitions</h2>
            <p>
                During the summer of 2018, I conducted research at Massachusetts Institute of Technology as part of the Research Science Institute summer program.
                Research Science Institute is an international fully paid research summer program worth approximately 8000 USD with over 3000 annual applicants to the 80 available spots,
                out of which two are reserved for Swedish students.
                <br/>
                During this program, I conducted research at the Center for Theoretical Physics on particle physics.
                I studied quark and gluon jets by simulating high energy particle collisions using the Pythia package with <code>C++</code>.
                I then analyzed the data using <code>Python</code> to identify the difference between quark and gluon jets.
                My main goal was to determine whether one of the definitions used for quark and gluon jets is useful.
                I then managed to show that this definition was in fact not operational.
            </p>
        </>
    );
}