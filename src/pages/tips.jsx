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
            "season subject type age archive"; {/*TODO: include separate academic and age bars?*/}
        `;

        const navWidgetNames = {
            search: 'input', searchButton: 'button', season: 'select', subject: 'select',
            type: 'select', age: 'div', archive: 'div'
        };

        let navWidgets = {};
        for (const widgetName in navWidgetNames) {
            navWidgets[widgetName] = styled(navWidgetNames[widgetName])`grid-area: ${widgetName}`;
        }

        this.getTips = this.getTips.bind(this);
        this.getInputChange = (event) => {
            if (event.target.type === 'checkbox') {
                this.setState({[event.target.id]: event.target.checked})
            }else {
                this.setState({[event.target.id]: event.target.value})
            }
        };

        this.Navigator = Navigator;
        this.navWidgets = navWidgets;
        this.state = {search: '', season: 'season', subject: 'subject', type: 'type', age: undefined, archive: false, sortedTips: tips};
    }

    static conditionsFullFilled(tip, criteria) {
        if (!(tip['season'] === criteria['season'] || criteria['season'] === 'season' || tip['season'] === 'season')) {
            return false;
        }
        else if (!(tip['type'].includes(criteria['type']) || criteria['type'] === 'type')) {
            return false;
        }
        else if (!(tip['subject'] === criteria['subject'] || criteria['subject'] === 'subject' || tip['subject'] === 'STEM')) {
            return false;
        }
        else if (!(!criteria['age'] || !tip['academic level'].hasOwnProperty('age') ||
                        tip['academic level'].age.includes(parseInt(criteria['age'], 10)))) {
            return false;
        }
        else if (!(tip['links'].some((link)=>(link.includes(criteria['search']))) ||
            tip['name'].toLowerCase().includes(criteria['search'].toLowerCase()) ||
            (tip['info'] !== null && tip['info'].toLowerCase().includes(tip['name'].toLowerCase())))) {
            return false;
        }
        else return criteria['archive'] || !tip.hasOwnProperty('archive') || !tip['archive'];
    }

    getTips () {
        const {sortedTips, ...criteria} = this.state;

        let chosenTips = [];
        tips.forEach(
            (tip)=>{
                if (Tips.conditionsFullFilled(tip, criteria)) {
                    chosenTips.push(tip);
                }
            }
        );
        this.setState({sortedTips: chosenTips});
    }

    render () {
        const navWidgets = this.navWidgets;
        return (
            <>
                <h1>Tips and Links to STEM-related Activities</h1>
                <this.Navigator>
                    <navWidgets.search type="text" placeholder="Enter some text..." id="search" onInput={this.getInputChange}/>
                    <navWidgets.searchButton onClick={this.getTips}>
                        Search
                    </navWidgets.searchButton>
                    <navWidgets.season id="season" onChange={this.getInputChange}>
                        <option value="season">season</option>
                        <option value="spring">spring</option>
                        <option value="summer">summer</option>
                        <option value="autumn">autumn</option>
                        <option value="winter">winter</option>
                    </navWidgets.season>
                    <navWidgets.subject id="subject" onChange={this.getInputChange}>
                        <option value="subject">subject</option>
                        <option value="physics">physics</option>
                        <option value="programming">programming</option>
                        <option value="astronomy">astronomy</option>
                        <option value="mathematics">mathematics</option>
                        <option value="biology">biology</option>
                        <option value="biology">biology</option>
                    </navWidgets.subject>
                    <navWidgets.type id="type" onChange={this.getInputChange}>
                        <option value="type">type</option>
                        <option value="camp">camp</option>
                        <option value="association">association</option>
                        <option value="competition">competition</option>
                        <option value="research">research</option>
                    </navWidgets.type>
                    <navWidgets.age>
                        <label htmlFor="age">Age:</label>
                        <input type="number" name="age" min="5" max="30" id="age" onChange={this.getInputChange}/>
                    </navWidgets.age>
                    <navWidgets.archive>
                        <input type="checkbox" name="archive" id="archive" onChange={this.getInputChange}/>
                        <label htmlFor="archive">Include archive</label>
                    </navWidgets.archive>
                </this.Navigator>
                {/*Renders all tips that has been sorted out using getTips.*/}
                {
                    this.state.sortedTips.length > 0 ?
                     (this.state.sortedTips.map((tip)=>(
                        <Collapsible title={tip.name} key={tip.name}>
                            {tip.links.map((link)=>(<a style={{marginRight:'1rem'}} href={link} key={link}>Link</a>))}
                            <p>{tip.info}</p>
                        </Collapsible>
                    ))) :
                    <p style={{textAlign: 'center', fontSize: '1.5rem'}}>Sorry, no tips in this list matched your requirements :(</p>
                }

                <p style={{textAlign: 'center', fontSize: '0.7rem'}}>
                    Disclaimer: While I do try to keep this site updated, the information here could still be outdated or incorrect.
                </p>
            </>
        );
    }
}
