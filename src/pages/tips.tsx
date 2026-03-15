import type {ChangeEvent, JSX} from 'react';
import {useState} from 'react';
import styled, {css} from 'styled-components';
import tipsData from '../data/tips.json';
import Collapsible from '../components/collapsible';
import {baseColor, textColor} from '../constants';
import type {TipEntry} from '../types';

const tips: TipEntry[] = tipsData;

type TipsCriteria = {
    search: string;
    season: string;
    subject: string;
    type: string;
    age?: string;
    archive: boolean;
};

const widgetStyle = css`
    background-color: ${baseColor};
    color: ${textColor};
    border: white;
`;

const Navigator = styled.div`
    display: grid;
    width: 100%;
    height: 3rem;
    margin-bottom: 1rem;
    grid-template-areas:
        "search search search search searchButton"
        "season subject type age archive";
`;

const SearchInput = styled.input`
    grid-area: search;
    ${widgetStyle};
`;

const SearchButton = styled.button`
    grid-area: searchButton;
    ${widgetStyle};
`;

const SeasonSelect = styled.select`
    grid-area: season;
    ${widgetStyle};
`;

const SubjectSelect = styled.select`
    grid-area: subject;
    ${widgetStyle};
`;

const TypeSelect = styled.select`
    grid-area: type;
    ${widgetStyle};
`;

const AgeContainer = styled.div`
    grid-area: age;
    ${widgetStyle};
`;

const ArchiveContainer = styled.div`
    grid-area: archive;
    ${widgetStyle};
`;

function conditionsFullFilled(tip: TipEntry, criteria: TipsCriteria): boolean {
    if (!(tip['season'] === criteria['season'] || criteria['season'] === 'season' || tip['season'] === 'season')) {
        return false;
    }
    else if (!(tip['type'].includes(criteria['type']) || criteria['type'] === 'type')) {
        return false;
    }
    else if (!(tip['subject'] === criteria['subject'] || criteria['subject'] === 'subject' || tip['subject'] === 'STEM')) {
        return false;
    }
    else if (!(!criteria['age'] || !Object.prototype.hasOwnProperty.call(tip['academic level'], 'age') ||
                    (tip['academic level'].age?.includes(Number.parseInt(criteria['age'], 10)) ?? false))) {
        return false;
    }
    else if (!(tip['links'].some((link) => (link.includes(criteria['search']))) ||
        tip['name'].toLowerCase().includes(criteria['search'].toLowerCase()) ||
        (tip['info'] !== null && tip['info'].toLowerCase().includes(tip['name'].toLowerCase())))) {
        return false;
    }
    else return criteria['archive'] || !Object.prototype.hasOwnProperty.call(tip, 'archive') || !tip['archive'];
}

const Tips: React.FC<JSX.Element> = () => {
    // TODO: Add expand/collapse all button
    // TODO: improve appearance of buttons with CSS
    const [search, setSearch] = useState<string>('');
    const [season, setSeason] = useState<string>('season');
    const [subject, setSubject] = useState<string>('subject');
    const [type, setType] = useState<string>('type');
    const [age, setAge] = useState<string | undefined>(undefined);
    const [archive, setArchive] = useState<boolean>(false);
    const [sortedTips, setSortedTips] = useState<TipEntry[]>(tips);

    const getInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        switch (event.target.id) {
            case 'search':
                setSearch(event.target.value);
                break;
            case 'season':
                setSeason(event.target.value);
                break;
            case 'subject':
                setSubject(event.target.value);
                break;
            case 'type':
                setType(event.target.value);
                break;
            case 'age':
                if (event.target instanceof HTMLInputElement) {
                    setAge(event.target.value || undefined);
                }
                break;
            case 'archive':
                if (event.target instanceof HTMLInputElement) {
                    setArchive(event.target.checked);
                }
                break;
            default:
                break;
        }
    };

    const getTips = (): void => {
        const criteria: TipsCriteria = {
            search,
            season,
            subject,
            type,
            age,
            archive
        };

        const chosenTips: TipEntry[] = [];
        tips.forEach((tip) => {
            if (conditionsFullFilled(tip, criteria)) {
                chosenTips.push(tip);
            }
        });
        setSortedTips(chosenTips);
    };

    return (
        <>
            <h1>Tips and Links to STEM-related Activities</h1>
            <Navigator>
                <SearchInput type='text' placeholder='Enter some text...' id='search' onChange={getInputChange}/>
                <SearchButton onClick={getTips}>
                    Search
                </SearchButton>
                <SeasonSelect id='season' onChange={getInputChange}>
                    <option value='season'>season</option>
                    <option value='spring'>spring</option>
                    <option value='summer'>summer</option>
                    <option value='autumn'>autumn</option>
                    <option value='winter'>winter</option>
                </SeasonSelect>
                <SubjectSelect id='subject' onChange={getInputChange}>
                    <option value='subject'>subject</option>
                    <option value='physics'>physics</option>
                    <option value='programming'>programming</option>
                    <option value='astronomy'>astronomy</option>
                    <option value='mathematics'>mathematics</option>
                    <option value='biology'>biology</option>
                    <option value='biology'>biology</option>
                </SubjectSelect>
                <TypeSelect id='type' onChange={getInputChange}>
                    <option value='type'>type</option>
                    <option value='camp'>camp</option>
                    <option value='association'>association</option>
                    <option value='competition'>competition</option>
                    <option value='research'>research</option>
                </TypeSelect>
                <AgeContainer>
                    <label htmlFor='age'>Age:</label>
                    <input type='number' name='age' min='5' max='30' id='age' onChange={getInputChange}/>
                </AgeContainer>
                <ArchiveContainer>
                    <input type='checkbox' name='archive' id='archive' onChange={getInputChange}/>
                    <label htmlFor='archive'>Include archive</label>
                </ArchiveContainer>
            </Navigator>
            {/*Renders all tips that has been sorted out using getTips.*/}
            {
                sortedTips.length > 0 ?
                 (sortedTips.map((tip) => (
                    <Collapsible title={tip.name} key={tip.name}>
                        {tip.links.map((link) => (<a style={{marginRight:'1rem'}} href={link} key={link}>Link</a>))}
                        <p>{tip.info}</p>
                    </Collapsible>
                ))) :
                <p style={{textAlign: 'center', fontSize: '1.5rem'}}>Sorry, no tips in this list matched your requirements :(</p>
            }

            <p style={{textAlign: 'center', fontSize: '0.7rem'}}>
                Disclaimer: While I do try to keep this site updated, the information here could still be outdated or incorrect.
            </p>
        </>
    );
}

export default Tips;
