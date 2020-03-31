import React from 'react';
import styled from 'styled-components';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        const Content = React.lazy(()=>(import('./pages/' + this.state.props.src)));

        const Sky = styled.div`
            background-image: linear-gradient(#000115, #1f1844, lightblue);
            width: 100%;
            min-height: 100%;
        `;

        const Planet = styled.div`
            background-image: url(${require('./images/' + props.image + '.svg')});
            position: absolute;
            bottom: 0;
            height: 10rem;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;
        `;
        this.state = {content: Content, background: Sky, planet: Planet, props};
    }

    render() {
        // TODO: make new planet images
        return (
            <this.state.background>
                <React.Suspense fallback={'loading...'}>
                    <this.state.content/>
                </React.Suspense>
                {/*This removes black bar at bottom of page*/}
                <span style={{height:'1rem', display:'block'}}/>
                {/*<this.state.planet/>*/}
            </this.state.background>
        );
    }
}