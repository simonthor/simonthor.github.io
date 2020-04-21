import React from 'react';
import tips from '../data/tips.json';
import styled from 'styled-components';
import Collapsible from '../components/collapsible';

export default class Tips extends React.Component {
    constructor(props) {
        super(props);
        // TODO: Add expand/collapse all button
        // TODO: improve appearance of buttons with CSS
        const Navigator = styled.div`
            display: grid;
            width: 100%;
            height: 3rem;
            margin-bottom: 1rem;
            grid-template-areas: 
            "search search search search searchButton"
            "season subject type age archive"; {/*include separate academic and age bars?*/}
        `;
        const searchBar = styled.input`
            grid-area: search;
            /*width: 100%;*/
        `;
        const searchButton = styled.button`
            grid-area: searchButton;
        `;
        const season = styled.select`
            grid-area: season;        
        `;
        const subject = styled.select`
            grid-area: subject;        
        `;
        const type = styled.select`
            grid-area: type;   
        `;
        // Currently, this one is set to academic level instead of age.
        const age = styled.select`
            grid-area: age;
        `;
        const archive = styled.div`
            grid-area: archive;
        `;

        this.state = {Navigator: Navigator, searchBar: searchBar, searchButton: searchButton,
            season: season, subject: subject, type: type, age: age, archive: archive,
            sortedTips:tips};

    }
    getTips () {
        // TODO: add this
        console.log('button pressed');
    }


    render () {
        return (
            <>
                <h1>Tips and Links to STEM-related Activities</h1>
                <this.state.Navigator>
                    <this.state.searchBar type="text" placeholder="Enter some text..."/>
                    <this.state.searchButton onClick={()=>{this.getTips()}}>
                        Search
                    </this.state.searchButton>
                    <this.state.season>
                        <option value="all">all</option>
                        <option value="spring">spring</option>
                        <option value="summer">summer</option>
                        <option value="autumn">autumn</option>
                        <option value="winter">winter</option>
                    </this.state.season>
                    <this.state.subject>
                        <option value="all">all</option>
                        <option value="physics">physics</option>
                        <option value="programming">programming</option>
                        <option value="astronomy">astronomy</option>
                        <option value="mathematics">mathematics</option>
                        <option value="biology">biology</option>
                        <option value="biology">biology</option>
                    </this.state.subject>
                    <this.state.type>
                        <option value="all">all</option>
                        <option value="camp">camp</option>
                        <option value="association">association</option>
                        <option value="competition">competition</option>
                        <option value="research">research</option>
                    </this.state.type>
                    {/*TODO: change option below to more specific years in academic level or age instead?*/}
                    <this.state.age>
                        <option value="all">all</option>
                        <option value="high school">high school</option>
                        <option value="university">university</option>
                    </this.state.age>
                    {/*TODO: change to slider?*/}
                    <this.state.archive>
                        <input type="checkbox" name="archive"/>
                        <label htmlFor="archive">Include archive</label>
                    </this.state.archive>
                </this.state.Navigator>
                {/*Renders all tips that has been sorted out using getTips.*/}
                {this.state.sortedTips.map((tip)=>(
                    <Collapsible title={tip.name}>
                        {tip.links.map((link)=>(<a style={{marginRight:'1rem'}} href={link}>Link</a>))}
                        <p>{tip.info}</p>
                    </Collapsible>
                ))}
            </>
        );
    }
}