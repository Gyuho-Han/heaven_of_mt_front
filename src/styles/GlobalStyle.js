
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DungGeunMo';
    src: url('/fonts/DungGeunMo.otf') format('opentype');
  }

  body {
    font-family: 'DungGeunMo', sans-serif;
    overflow: hidden;
  }
`;

export default GlobalStyle;
