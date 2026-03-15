import {Fragment, JSX, useEffect, useState} from 'react';
import styled from 'styled-components';
import Planet from '../components/planet';
import planetsData from '../data/planets.json';
import type {PlanetData} from '../types';

const planets: PlanetData[] = planetsData;

const MobileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

type ScreenSize = {
    screenWidth: number;
    screenHeight: number;
};

const SolarSystem: React.FC<JSX.Element> = () => {
    const [screenSize, setScreenSize] = useState<ScreenSize>({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    });

    useEffect(() => {
        const handleWindowSizeChange = (): void => {
            setScreenSize({
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight
            });
        };

        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = (Math.min(screenSize.screenWidth, screenSize.screenHeight) < 500);

    let planetContainer: JSX.Element;
    if (isMobile) {
        planetContainer = (
            <MobileContainer>
                {planets.map((planet) => {
                    const {radius, ...rest} = planet;
                    return (
                        <Fragment key={`${planet.text}-mobile`}>
                            <Planet {...rest}/>
                            <p>{planet.text}</p>
                        </Fragment>
                    );
                })}
            </MobileContainer>
        );
    }
    else {
        planetContainer = (
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
            {planetContainer}
        </>
    );
}

export default SolarSystem;
