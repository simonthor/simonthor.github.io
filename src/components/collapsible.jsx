import React from 'react';
import styled from 'styled-components';
import {textColor, baseColor} from '../constants';

export default class Collapsible extends React.Component {
    constructor(props){
        super(props);
        const Header = styled.div`
            cursor: pointer;
            border: solid 1px #f2f2f2;
            padding: 15px;
            background-color: ${baseColor};
            color: ${textColor};
        `;
        this.state = {
            open: false,
            header: Header
        };
    }

    togglePanel(e){
        this.setState({open: !this.state.open})
    }

    render() {
        return (
            <div>
                <this.state.header onClick={(e)=>this.togglePanel(e)}>
                    {this.props.title}
                </this.state.header>
                {this.state.open ? (
                <div className='content'>
                    {this.props.children}
                </div>
                ) : null}
            </div>
        );
    }
}
/*
        .header{
        cursor: pointer;
        border: solid 1px #f2f2f2;
        padding: 15px;
        background-color: #0089CC;
        color: #FFF;
        font-family: verdana;
        }

        .content{
        cursor: pointer;
        border-left: solid 1px #f2f2f2;
        border-right: solid 1px #f2f2f2;
        border-bottom: solid 1px #f2f2f2;
        border-radius: 0 0 5px 5px;
        padding: 15px;
        font-family: verdana;
        font-size: 14px;
        }
        */