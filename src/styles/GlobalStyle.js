
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Global smooth scrolling for anchor/programmatic scrolls */
  html {
    scroll-behavior: smooth;
  }

  @font-face {
    font-family: 'DungGeunMo';
    src: url('/fonts/DungGeunMo.otf') format('opentype');
  }

  body {
    font-family: 'DungGeunMo', sans-serif;
    margin: 0; /* remove default body margin to use full viewport width */
    padding: 0;
    /* Avoid forcing fixed viewport sizing to enable scrolling on tablets */
    width: 100%;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* momentum scroll on iOS */
  }
`;

export default GlobalStyle;
