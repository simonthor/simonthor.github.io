import React from 'react';
import styled from 'styled-components';

export default class Page extends React.Component {
    constructor(props) {
        super(props);

        let Sky = styled.div`
            background-image: linear-gradient(#000115, #1f1844, lightblue);
            width: 100%;
            height: 100%;
        `;

        let Planet = styled.div`
            background-image: url(${require('./images/' + props.image + '.svg')});
            position: absolute;
            bottom: 0;
            height: 10rem;
            width: 100%;
            background-size: cover;
            background-repeat: no-repeat;
        `;

        this.state = {background: Sky, planet: Planet, props};
    }

    render() {
        // TODO: render not working
        console.log('./pages/' + this.state.props.src);
        const Content = React.lazy(()=>(import('./pages/' + this.state.props.src)));
        // TODO: make new planet images
        return (
            <this.state.background>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Content/>
                </React.Suspense>
                {/*<this.state.planet/>*/}
            </this.state.background>
        );
    }
}