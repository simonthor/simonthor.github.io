import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';
import {Planet} from './solar-system';
import ReactTooltip from 'react-tooltip';
import Page from '../page';
import jupiter from '../images/jupiter.svg';


function requireAll(directory, fileExtension) {
    const r = require.context(directory, false, new RegExp('.' + fileExtension));
    let files = {};
    r.keys().forEach((key) => {
        files[key.substring(key.indexOf('/')+1, key.length-fileExtension.length-1)] = r(key)
    });
    return files;
}

export default function Test (props) {

    return (
        <Page/>
    );
}