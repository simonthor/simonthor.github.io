import React from 'react';
import {Link} from 'react-router-dom';

export default function About() {
    return (
        <>
            <h1>Introduction</h1>
            <h2>Summary</h2>
            <p>
                I am an engineering physics student at KTH Royal Institute of Technology.
                I also conduct research at the same university about space physics.
                Besides research, I have an interest in web development, data science, and science outreach.
            </p>
            {/*TODO: Implement hash links so that links below work.*/}
            <h2>Research Experience</h2>
            <ul>
                <li><Link to="/research#FTE">Flux transfer events</Link></li>
                <li><Link to="/research#TPA">Transpolar arcs</Link> </li>
                <li><Link to="/research#jet">Quark and gluon jets</Link> </li>
            </ul>
            <h2>Programming Languages</h2>
            <ul>
                <li><Link to="/programming#python">Python</Link></li>
                <li><Link to="/programming#matlab">MATLAB</Link> </li>
                <li><Link to="/programming#javascript">Javascript</Link></li>
                <li><Link to="/programming#c++">C++</Link></li>
                <li><Link to="/programming#java">Java</Link></li>
            </ul>
        </>
    );
}