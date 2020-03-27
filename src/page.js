import React from 'react';
import styled from 'styled-components';
import jupiter from './images/jupiter.svg';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        let Sky = styled.div`
            background-image: linear-gradient(#000115, #1f1844, lightblue);
            width: 100%;
            height: 100%;
        `;

        let Planet = styled.div`
            background-image: url(${jupiter});
            position: absolute;
            bottom: 0;
            height: 10rem;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;
        `;

        this.state = {background: Sky, planet: Planet};
    }

    render() {
        //const Sky = this.state.background;
        //const Planet = this.state.planet;
        return (
            <this.state.background>
                {/*<this.state.planet/>*/}
            </this.state.background>
        );
    }
}