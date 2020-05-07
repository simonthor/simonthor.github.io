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

        const navWidgetNames = {
            search: 'input', searchButton: 'button', season: 'select', subject: 'select',
            type: 'select', age: 'div', archive: 'div'
        };

        let refs = {};
        let navWidgets = {};
        for (const widgetName in navWidgetNames) {
            navWidgets[widgetName] = styled(navWidgetNames[widgetName])`grid-area: ${widgetName}`;
            refs[widgetName] = React.createRef();
        }

        // Probably bad practice
        this.state = {Navigator: Navigator, navWidgets: navWidgets, sortedTips:tips, refs:refs};

    }

    conditionsFullFilled(tip, criteria) {
        if (!(tip['season'] === criteria['season'] || criteria['season'] === 'all')) {
            return false;
        }
        else if (!(tip['type'].includes(criteria['type']) || criteria['type'] === 'all')) {
            return false;
        }
        else if (!(tip['subject'] === criteria['subject'] || criteria['subject'] === 'all')) {
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
        else if (!(criteria['archive'] || !tip.hasOwnProperty('archive') || !tip['archive'])) {
            return false;
        }
        else {
            return true;
        }
    }

    getTips () {
        // clean the criteria inputted by the user and create an object of it.
        const criteria = {};
        for (const optionSelector in this.state.refs) {
            const widget = this.state.refs[optionSelector];
            if (widget.current === null) {
                criteria[optionSelector] = widget.value;
            } else if (widget.current.type === 'checkbox') {
                criteria[optionSelector] = widget.current.checked;
            } else {
                criteria[optionSelector] = widget.current.value;
            }
        }
        // Create an array of the tips that match the criteria above.
        // Uses the conditionsFulfilled function
        let chosenTips = [];
        tips.forEach(
            (tip)=>{
                if (this.conditionsFullFilled(tip, criteria)) {
                    chosenTips.push(tip);
                }
            }
        );
        this.setState({sortedTips: chosenTips});
    }

    render () {
        const navWidgets = this.state.navWidgets;
        return (
            <>
                <h1>Tips and Links to STEM-related Activities</h1>
                <this.state.Navigator>
                    <navWidgets.search type="text" placeholder="Enter some text..." ref={this.state.refs.search}/>
                    <navWidgets.searchButton onClick={()=>{this.getTips()}}>
                        Search
                    </navWidgets.searchButton>
                    <navWidgets.season ref={this.state.refs.season}>
                        <option value="all">all</option>
                        <option value="spring">spring</option>
                        <option value="summer">summer</option>
                        <option value="autumn">autumn</option>
                        <option value="winter">winter</option>
                    </navWidgets.season>
                    <navWidgets.subject ref={this.state.refs.subject}>
                        <option value="all">all</option>
                        <option value="physics">physics</option>
                        <option value="programming">programming</option>
                        <option value="astronomy">astronomy</option>
                        <option value="mathematics">mathematics</option>
                        <option value="biology">biology</option>
                        <option value="biology">biology</option>
                    </navWidgets.subject>
                    <navWidgets.type ref={this.state.refs.type}>
                        <option value="all">all</option>
                        <option value="camp">camp</option>
                        <option value="association">association</option>
                        <option value="competition">competition</option>
                        <option value="research">research</option>
                    </navWidgets.type>
                    <navWidgets.age>
                        <label htmlFor="age">Age:</label>
                        <input type="number" name="age" min="5" max="30" ref={this.state.refs.age}/>
                    </navWidgets.age>
                    <navWidgets.archive>
                        <input type="checkbox" name="archive" ref={this.state.refs.archive}/>
                        <label htmlFor="archive">Include archive</label>
                    </navWidgets.archive>
                </this.state.Navigator>
                {/*Renders all tips that has been sorted out using getTips.*/}
                {this.state.sortedTips.map((tip)=>(
                    <Collapsible title={tip.name} key={tip.name}>
                        {tip.links.map((link)=>(<a style={{marginRight:'1rem'}} href={link} key={link}>Link</a>))}
                        <p>{tip.info}</p>
                    </Collapsible>
                ))}
            </>
        );
    }
}