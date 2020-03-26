import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';
import {Planet} from './solar-system';

export default function Test (props) {
    // Does not work
    const X = styled(Planet)`
        color: blue;
    `;
    return <X text="cnksdjbvnks" href="/test" size={7} color="red"/>;

}