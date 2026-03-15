import type {ComponentType} from 'react';
import styled, {keyframes} from 'styled-components';
import {Link} from 'react-router-dom';
import {Tooltip} from 'react-tooltip';
import type {PlanetData} from '../types';

const ROTATION_CONSTANT = 0.05;

type PlanetProps = PlanetData;

type PlanetContainerProps = {
    to: string;
    'data-tooltip-id': string;
    'data-tooltip-content': string;
};

function createPlanetContainer(props: PlanetProps): ComponentType<PlanetContainerProps> {
    const {height, image, radius} = props;
    const width = props['width-rel'] ? props['width-rel'] * props.height : props.height;

    let dynamicContainer: ComponentType<PlanetContainerProps> = styled(Link)`
        display: inline-block;
        text-align: center;
        color: white;
        height: ${height}rem; width: ${width}rem; line-height: ${height}rem;
        background-image: url("/images/${image}.svg");
        background-size: cover;
    `;

    if (typeof radius === 'number') {
        // Having an orbit radius implies that the planet should be moving
        const radiusPixels = Math.floor(radius / 100 * Math.min(window.innerWidth, window.innerHeight) / 2);
        // Kepler's law: https://sv.wikipedia.org/wiki/Keplers_lagar
        const orbitPeriod = Math.floor(Math.sqrt(Math.pow(radius, 3) * ROTATION_CONSTANT));
        const orbit = keyframes`
            from {
                transform: rotate(0deg) translateX(${radiusPixels}px) rotate(0deg)
            }
            to {
                transform: rotate(360deg) translateX(${radiusPixels}px) rotate(-360deg);
            }
        `;

        dynamicContainer = styled(dynamicContainer)`
            position: fixed;
            margin-top: ${-height / 2}rem; margin-left: ${-width / 2}rem;
            top: 50%; left: 50%;
            animation: ${orbit} ${orbitPeriod}s linear infinite;

            &:hover {
                animation-play-state: paused;
            }
        }

        `;
    }

    return dynamicContainer;
}

export default function Planet(props: PlanetProps): JSX.Element {
    const {text, href} = props;
    const Container = createPlanetContainer(props);
    const tooltipId = `${text}-p`;

    return (
        <>
            <Tooltip id={tooltipId} place='bottom' variant='dark'/>
            <Container
                to={href}
                data-tooltip-id={tooltipId}
                data-tooltip-content={text} />
        </>
    );
}
