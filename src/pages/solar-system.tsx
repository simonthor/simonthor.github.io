import planets from '../data/planets.json';
import React from 'react';
import styled from 'styled-components';
import Planet from '../components/planet';

export default class SolarSystem extends React.Component {
    constructor(props) {
        super(props);

        this.MobileContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        this.state = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange = () => {
        this.setState({ screenWidth: window.innerWidth , screenHeight: window.innerHeight});
    };

    render () {
        const isMobile = (Math.min(this.state.screenWidth, this.state.screenHeight) < 500);
        let PlanetContainer;
        if (isMobile) {
            PlanetContainer = (
                <this.MobileContainer>
                    {planets.map((planet) => {
                        const {radius, ...rest} = planet;
                        return (
                            <>
                                <Planet key={planet.text} {...rest}/>
                                <p>{planet.text}</p>
                            </>
                        );}
                    )}
                </this.MobileContainer>
            );
        }
        else {
            PlanetContainer = (
                <div>
                    {planets.map((planet) =>
                        <Planet key={planet.text} {...planet}/>
                    )}
                </div>
            );
        }

        return (
            <>
                <div style={{textAlign: 'center'}}>
                    <h1 style={{marginTop: 0}}>Simon Thor</h1>
                    <p>Click on one of the planets to find out more</p>
                </div>
                {PlanetContainer}
            </>
        );
    }

}