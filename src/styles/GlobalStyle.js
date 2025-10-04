
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DungGeunMo';
    src: url('/fonts/DungGeunMo.otf') format('opentype');
  }

  body {
    font-family: 'DungGeunMo', sans-serif;
    margin: 0; /* remove default body margin to use full viewport width */
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
`;

export default GlobalStyle;
