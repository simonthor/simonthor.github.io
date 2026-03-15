import type {ReactNode} from 'react';
import {useState} from 'react';
import styled from 'styled-components';
import {textColor, baseColor} from '../constants';

type CollapsibleProps = {
    title: string;
    children?: ReactNode;
};

const Header = styled.div`
    cursor: pointer;
    border: solid 1px #f2f2f2;
    padding: 15px;
    background-color: ${baseColor};
    color: ${textColor};
`;

export default function Collapsible({title, children}: CollapsibleProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Header onClick={() => setOpen((state) => !state)}>
                {title}
            </Header>
            {open ? (
            <div className='content'>
                {children}
            </div>
            ) : null}
        </div>
    );
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
