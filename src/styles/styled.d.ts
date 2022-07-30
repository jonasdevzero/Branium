import 'styled-components';
import { defaultTheme } from '@/styles/theme';

declare module 'styled-components' {
  type ThemeType = typeof defaultTheme;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeType {}
}
