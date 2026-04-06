import type {ComponentType, LazyExoticComponent} from 'react';
import {lazy, Suspense} from 'react';
import styled from 'styled-components';

type PageProps = {
    src: string;
    image?: string;
};

const pageComponents: Record<string, LazyExoticComponent<ComponentType>> = {
    about: lazy(() => import('../pages/about')),
    feynman: lazy(() => import('../pages/feynman')),
    tips: lazy(() => import('../pages/tips')),
    programming: lazy(() => import('../pages/programming')),
    research: lazy(() => import('../pages/research')),
    fractals: lazy(() => import('../pages/fractals')),
    error: lazy(() => import('../pages/error'))
};

const Background = styled.div`
    flex: 1;
    background-image: linear-gradient(#000115, #1f1844, #304D6D);
    max-width: 100%;
    min-height: 100%;
    padding-right: 2rem; padding-left: 2rem;

    /*
     * The CSS below is a modified version of the Slate theme.
     * Reference: https://github.com/pages-themes/slate
     */
    & h1, h2, h3, h4, h5, h6 {
        margin: 10px 0;
        font-weight: 700;
        color: white;
        font-family: inherit;
        letter-spacing: -1px;
    }

    & h1 {
      font-size: 36px;
      font-weight: 700;
    }

    & h2 {
      padding-bottom: 10px;
      font-size: 32px;
    }

    & h3 {
      font-size: 24px;
    }

    & h4 {
      font-size: 21px;
    }

    & h5 {
      font-size: 18px;
    }

    & h6 {
      font-size: 16px;
    }

    & p {
      margin: 10px 0 15px 0;
    }

    & footer p {
      color: #f2f2f2;
    }

    & a {
      text-decoration: none;
      color: #63ADF2;
      text-shadow: none;
    }

    & a:hover, a:focus {
      text-decoration: underline;
    }

    & footer a {
      color: #F2F2F2;
      text-decoration: underline;
    }

    & em, cite {
      font-style: italic;
    }

    & strong {
      font-weight: bold;
    }

    & img {
      position: relative;
      max-width: 739px;
      padding: 5px;
      margin: 10px 0 10px 0;
      border: 1px solid #ebebeb;

      box-shadow: 0 0 5px #ebebeb;
      -webkit-box-shadow: 0 0 5px #ebebeb;
      -moz-box-shadow: 0 0 5px #ebebeb;
      -o-box-shadow: 0 0 5px #ebebeb;
    }

    & p img {
      display: inline;
      margin: 0;
      padding: 0;
      vertical-align: middle;
      text-align: center;
      border: none;
    }

    & pre, code {
      color: #fff;
      background-color: #2b2b2b;

      font-family: Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, monospace;
      font-size: 0.875em;

      border-radius: 2px;
      -moz-border-radius: 2px;
      -webkit-border-radius: 2px;
    }

    & pre {
      padding: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
      overflow: auto;
    }

    & code {
      padding: 3px;
      margin: 0 3px;
      box-shadow: 0 0 10px rgba(0,0,0,.1);
    }

    & pre code {
      display: block;
      box-shadow: none;
    }

    & blockquote {
      color: #666;
      margin-bottom: 20px;
      padding: 0 0 0 20px;
      border-left: 3px solid #bbb;
    }


    & ul, ol, dl {
      margin-bottom: 15px
    }

    & ul {
      list-style: disc inside;
      padding-left: 20px;
    }

    & ol {
      list-style: decimal inside;
      padding-left: 20px;
    }

    & dl dt {
      font-weight: bold;
    }

    & dl dd {
      padding-left: 20px;
      font-style: italic;
    }

    & dl p {
      padding-left: 20px;
      font-style: italic;
    }

    & hr {
      height: 1px;
      margin-bottom: 5px;
      border: none;
    }

    & table {
      border: 1px solid #373737;
      margin-bottom: 20px;
      text-align: left;
     }

    & th {
      font-family: 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      padding: 10px;
      background: #373737;
      color: #fff;
     }

    & td {
      padding: 10px;
      border: 1px solid #373737;
     }

    & form {
      background: #f2f2f2;
      padding: 20px;
    }
`;

const Page = ({src}: PageProps) => {
    const Content = pageComponents[src] ?? pageComponents.error;

    // TODO: make new planet images
    return (
        <Background>
            <Suspense fallback={'loading...'}>
                <Content/>
            </Suspense>
            {/*This removes black bar at bottom of page*/}
            <span style={{height:'1rem', display:'block'}}/>
        </Background>
    );
}

export default Page;
