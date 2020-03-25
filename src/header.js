import React from 'react';
import {Planet} from "./pages/solar-system";
//import styled from 'styled-components';

export default function Header () {
    // TODO: add margin directly to planets using styled-components
    return (
        <nav>
            <Planet href="/" text="Home" size={3} color="blue"/>
            <span style={{marginRight: '1rem'}}/>
            <Planet href="/about" text="About" size={3} color="red"/>
        </nav>
    );
}