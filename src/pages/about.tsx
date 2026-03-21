import { useEffect } from 'react';
import {Link} from 'react-router-dom';

const About = () => {
    useEffect(()=>{
        if(typeof window?.MathJax !== "undefined"){
        window.MathJax.typeset()
        }
    },[])
    const FASERnu = String.raw`FASER\(\nu\)`;

    return (
        <>
            <h1>Introduction</h1>
            <h2>Summary</h2>
            <p>
                Hi!<br/>
                I am a PhD student at ETH Zürich in Switzerland, where I conduct research in particle physics. 
                My main focus is on a particle called the neutrino, which is one of the most elusive particles in the universe, and might hold the key to understanding why there is something in the universe rather than nothing.
                The experiment I primarily work with is <a href="https://faser.web.cern.ch/" target="_blank" rel="noopener noreferrer">FASER</a>, which is located at CERN, Geneva: the largest particle physics laboratory in the world. 
                CERN is also where my office is.<br/>
                Besides research, I have an interest in web development, data science, and science outreach. In my free time, I enjoy reading, playing board games and traveling.
            </p>
            {/*TODO: Implement hash links so that links below work.*/}
            <h2>Research projects</h2>
            <ul>
                <li><Link to="/research#tau">Tau neutrino searches</Link></li>
                <li><Link to="/research#charm">Charm hadron searches</Link></li>
                <li><Link to="/research#reconnection">Improved track reconstruction of {FASERnu} data</Link></li>
                <li><Link to="/research#icecube">Searching for tau neutrinos with the IceCube detector</Link></li>
                <li><Link to="/research#hnl">Can heavy neutrinos be found using a linear collider?</Link></li>
                <li><Link to="/research#emerging-jets">Recasting ATLAS analyses to constrain dark sector QCD</Link></li>
                <li><Link to="/research#lhcb">Improving LHCb simulation software</Link></li>
                <li><Link to="/research#yoda">Visualizing 2D histograms in <code>YODA</code> and <code>Rivet</code></Link></li>
                <li><Link to="/research#tpa">Aurora research: Transpolar arcs</Link> </li>
                <li><Link to="/research#fte">Flux transfer events</Link></li>
                <li><Link to="/research#jet">Machine learning classification of quark and gluon jets</Link> </li>
            </ul>
            <h2>Programming Languages</h2>
            <ul>
                <li><Link to="/programming#python">Python</Link></li>
                <li><Link to="/programming#c++">C++</Link></li>
                <li><Link to="/programming#javascript">Javascript</Link></li>
                <li><Link to="/programming#matlab">MATLAB</Link></li>
                <li><Link to="/programming#julia">Julia</Link></li>
                <li><Link to="/programming#java">Java</Link></li>
            </ul>
        </>
    );
}

export default About;
