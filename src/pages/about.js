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
            <li>
                <ol><a href="/research/kth#FTE">Flux transfer events</a></ol>
                <ol><a href="/research/kth#TPA">Transpolar arcs</a> </ol>
                <ol><a href="/research/mit#jet">Quark and gluon jets</a> </ol>
            </li>
            <h2>Programming Languages</h2>
            <li>
                <ol><a href="/programming#python">Python</a></ol>
                <ol><a href="/programming#matlab">MATLAB</a> </ol>
                <ol><a href="/programming#javascript">Javascript</a></ol>
            </li>
        </>
    );
}