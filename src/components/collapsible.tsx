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

const Collapsible = ({title, children}: CollapsibleProps) => {
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

export default Collapsible;
