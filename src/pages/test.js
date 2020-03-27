import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';
import {Planet} from './solar-system';
import ReactTooltip from 'react-tooltip';

function requireAll(directory, fileExtension) {
    const r = require.context(directory, false, new RegExp('.' + fileExtension));
    let files = {};
    r.keys().forEach((key) => {
        files[key.substring(key.indexOf('/')+1, key.length-fileExtension.length-1)] = r(key)
    });
    return files;
}

export default function Test (props) {
    const image = require('../images/jupiter.svg');
    const Imgdiv = styled.div`
        background-image: url("${image}");
        background-size: cover;
        width: 5rem; height: 5rem;
    `;

    return (
        <>
            <ReactTooltip place="top" type="dark" effect="float"/>
            <Imgdiv data-tip="Show this" >
                <Link to="/">hi</Link>
            </Imgdiv>
            <Imgdiv data-tip="Show that" >
                <Link to="/">hi</Link>
            </Imgdiv>
        </>
        );
}