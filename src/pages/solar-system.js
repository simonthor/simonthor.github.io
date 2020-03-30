import planets from '../data/planets.json';
import React from 'react';
import styled from 'styled-components';
import Planet from '../components/planet';

export default class SolarSystem extends React.Component {
    // TODO: more styling to top text?
    constructor(props) {
        super(props);

        let MobileContainer = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        this.state = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            MobileContainer: MobileContainer
        };
    }

    componentWillMount() {
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
                <this.state.MobileContainer>
                    {planets.map(
                        (planet) => {
                            const {radius, ...rest} = planet;
                            return (
                                <>
                                    <Planet key={planet.text} {...rest}/>
                                    <p>{planet.text}</p>
                                </>
                            );
                        }
                    )}
                </this.state.MobileContainer>
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
                    <h1>Simon Thor</h1>
                    <p>Click on one of the planets to find out more</p>
                </div>
                {PlanetContainer}
            </>
        );
    }

}