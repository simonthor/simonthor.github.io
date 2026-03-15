import styled from 'styled-components';
import React from 'react';

export default function Footer() {
    const Container = styled.p`
            position: fixed;
            bottom: 0;
            right: 0;
            font-size: 0.8rem;
            color: #fff;
            background-color: #2b2b2b;
            border-radius: 2px;
            -moz-border-radius: 2px;
            -webkit-border-radius: 2px;
            padding: 3px;
            margin: 3px;
            box-shadow: 0 0 10px rgba(0,0,0,.1);
        `;

    return <Container>Simon Thor</Container>;

}
