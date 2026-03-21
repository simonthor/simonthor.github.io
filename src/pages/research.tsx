import React, { useEffect } from 'react';

const Research = () => {
    useEffect(()=>{
        if(typeof window?.MathJax !== "undefined"){
        window.MathJax.typeset()
        }
    },[])
    const FASERnu = String.raw`FASER\(\nu\)`;

    return (
        <>
            <h1>Research Experience</h1>
            <p>
                Here are all the research projects I have worked on so far.
                When available, I have linked to a scientific article, preprint, or report that I (co-)authored.
                This is still a work in progress, so there's still some text missing. Feel free to check back later for updates, or check the linked articles and reports for more information in the meantime!
            </p>
            <section id="tau">
                <h2>Tau neutrino searches</h2>
                <a href="https://doi.org/10.2172/3019364">Poster</a>
                <p>
                    The tau neutrino is the least studied fundamental particle that is known to exist. So far, only 19 tau neutrinos have ever been directly observed. 19! That is almost nothing. Compare that to the Higgs boson, 
                </p>
            </section>
            <section id="charm">
                <h2>Charm hadron searches</h2>
                <a href="https://cds.cern.ch/record/2956186/">Preliminary results</a>
                <br/>
                <img src="/images/charm_production_feynman_diagram.svg" alt="Feynman diagram of charm hadron production" style={{ border: 'none' }} />
                <br/>
                <p>
                    The so-called charm quark is one of the fundamental particles. The charm quark can be produced from neutrino interactions, as shown in the Feynman diagram above.
                    Neutrino-induced charm production is an interesting process to study for many reasons:
                </p>
                <ul>
                    <li>The production rate of charm hadrons is directly linked to how much strange quark content the proton has (in more technical terms, it measures the strange parton distribution function), which is important for all of particle physics when looking for e.g. the Higgs boson</li>
                    <li>Electron neutrino-induced charm production has never been observed. This could be because there is some unknown physics beyond what we already know. Very exciting!</li>
                    <li>The charm quark has a large mass, so measuring the production rate and kinematics is a good test of quantum chromodynamics: the theory that describes the strong nuclear force</li>
                    <li>There is some evidence that the proton does not only consist of up and down quarks, but also a small fraction of charm quarks. Proving or disproving this would be a major discovery!</li>
                    <li>Searching for charm hadrons is a very similar process as searching for tau leptons produced from tau neutrinos. Looking for charm hadrons is an important step in preparation for finding tau neutrinos.</li>
                </ul>
                <p>
                    I am currently the main responsible person for searching for charm hadrons produced in {FASERnu}. Preliminary results were presented at the Moriond conference in 2026, with new results expected to be presented soon.
                </p>
            </section>
            <section id="reconnection">
                <h2>Improved track reconstruction of {FASERnu} data</h2>
                <a href="https://indico.cern.ch/event/1613759/contributions/6809844/">Slides</a> <a href="https://cds.cern.ch/record/2956166">Report that mentions the work</a>
                <p>
                    I am actively involved in improving the reconstruction of the tracks in {FASERnu} data.
                    Having good track quality is vital for being able to perform all analyses of the data and search for e.g. neutrinos.
                    Previously, broken and problematic tracks were fixed by hand, which was not a sustainable solution as more data is collected.
                    After taking over work from a previous master student, I significantly improved the track reconstruction by implementing an algorithm that automatically identifies and fixes broken tracks.
                    This removed the need for manual track fixing, significantly speeding up the data analysis workflow and allowing us to analyze more data in a shorter time.
                </p>
            </section>
            <section id="icecube">
                <h2>Searching for tau neutrinos with the IceCube detector</h2>
                <a href="https://www.diva-portal.org/smash/record.jsf?aq2=%5B%5B%5D%5D&c=2&af=%5B%22publicationTypeCode%3AstudentThesis%22%2C%22thesisLevel%3AH2%22%5D&searchType=SIMPLE&sortOrder2=title_sort_asc&query=Simon+Thor&language=en&pid=diva2%3A1865478&aq=%5B%5B%5D%5D&sf=all&aqe=%5B%5D&sortOrder=author_sort_asc&onlyFullText=false&noOfRows=50&dswid=-2573">Master thesis</a>
                <p>Explanation coming soon! In the meantime, check the link above</p>
            </section>
            <section id="hnl">
                <h2>Can heavy neutrinos be found using a linear collider?</h2>
                <a href="https://doi.org/10.1103/physrevd.110.075028">Paper</a>
                <p>Explanation coming soon! In the meantime, check the link above</p>
            </section>
            <section id="emerging">
                <h2>Recasting ATLAS analyses to constrain dark sector QCD</h2>
                <a href="https://www.diva-portal.org/smash/record.jsf?dswid=-9208&pid=diva2%3A1678955&c=2&searchType=SIMPLE&language=en&query=Simon+Thor&af=%5B%22publicationTypeCode%3AstudentThesis%22%2C%22thesisLevel%3AM2%22%2C%22personName%3A%5C%22Thor%2C+Simon%5C%22%22%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all">Bachelor thesis</a>
                <p>Explanation coming soon! In the meantime, check the link above</p>
            </section>
            <section id="lhcb">
                <h2>Improving LHCb simulation software</h2>
                <a href="https://repository.cern/records/fps0t-5kk91">Project report</a> <a href="https://videos.cern.ch/record/3003050">Presentation</a>
                <p>Explanation coming soon! In the meantime, check the links above</p>
            </section>
            <section id="yoda">
                <h2>Visualizing 2D histograms in <code>YODA</code> and <code>Rivet</code></h2>
                <a href="https://doi.org/10.21468/scipostphyscodeb.45">Paper</a> <a href="https://simonthor.github.io/GSoC-2021/">Project report</a>
                <p>Explanation coming soon! In the meantime, check the links above</p>
            </section>
            <section id="tpa">
                <h2>Aurora research: Transpolar arcs</h2>
                <a href="https://doi.org/10.1029/2022ja030987">First paper</a> <a href="https://doi.org/10.1029/2023gl103816">Second paper</a>
                <p>
                    In 2019, I began studying at KTH Royal Institute of Technology and also continued my research work at the department of space and plasma physics at the same university.
                    This research focused on investigating the connection between FTEs and magnetosheath jets, a localized plasma region with a high kinetic energy.
                    <br/>
                    The results have been presented at the Swedish Space Plamsa Physics Meeting in 2020, a conferene for all Swedish space plasma physicists.
                    During this conference, I held a presentation on my current work to the ~50 participants.
                </p>
            </section>
            <section id="fte">
                <h2>The Difference Between Isolated Flux Transfer Events and Flux Transfer Event Cascades</h2>
                <a href="https://doi.org/10.1029/2019JA026629">Paper</a>
                <p>
                    During 2017 - 2019, I worked at the department of space and plasma physics at KTH Royal Institute of Technology and conducted research about flux transfer events (FTEs).
                    Using <code>Python</code>, I analyzed and visualized data from the Cluster satellites and OMNI data. The research was in collaboration with an associate professor at the department.
                    <br/>
                    These results were published in the <i>Journal of Geophysical Research - Space Physics</i> in 2019, and I became one of the youngest in Sweden to ever publish a scientific paper.
                    I also presented at two poster sessions: the Swedish national high school science fair (where I proceeded to the final),
                    and the "Svenska Rymdforskares Samarbetsgrupp" conference (a conference for space researchers in Sweden), both in 2019.
                </p>
            </section>

            <section id="jet">
                <h2>Debunking Quark and Gluon Jet Definitions</h2>
                <p>
                    During the summer of 2018, I conducted research at Massachusetts Institute of Technology as part of the Research Science Institute summer program.
                    Research Science Institute is an international fully paid research summer program worth approximately 8000 USD with over 3000 annual applicants to the 80 available spots,
                    out of which two are reserved for Swedish students.
                    <br/>
                    During this program, I conducted research at the Center for Theoretical Physics on particle physics, together with two PhD students.
                    I studied quark and gluon jets by simulating high energy particle collisions using the Pythia package with <code>C++</code>.
                    I then analyzed the data using <code>Python</code> to identify the difference between quark and gluon jets.
                    My main goal was to determine whether one of the definitions used for quark and gluon jets is useful.
                    I then managed to show that this definition was in fact not operational.
                    <br/>
                    I presented my results at the end of Research Science Institute through a presentation as well as writing a report.
                    After the program, I continued the research with my mentors and participated in the final of the Swedish national science fair in 2019.
                </p>
            </section>
        </>
    );
}

export default Research;
