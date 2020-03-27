import React from 'react';

export default function About() {
    return (
        <>
            <h1>Hi! My name is Simon</h1>
            <h2>Summary</h2>
            <p>
                I am an engineering physics student at KTH Royal Institute of Technology.
                I also conduct research at the same university about <a className="normal" href="/research/kth">space physics</a>.
            </p>
            <h2>Research Experience</h2>
            <ul>
                <li><a href="/research/kth#FTE">Flux transfer events</a></li>
                <li><a href="/research/kth#TPA">Transpolar arcs</a> </li>
                <li><a href="/research/mit#jet">Quark and gluon jets</a> </li>
            </ul>
            <h2>Programming Languages</h2>
            <ul>
                <li><a href="/programming#python">Python</a></li>
                <li><a href="/programming#matlab">MATLAB</a> </li>
                <li><a href="/programming#javascript">Javascript</a></li>
            </ul>
        </>
    );
}