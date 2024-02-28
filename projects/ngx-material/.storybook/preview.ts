import type {Decorator} from "@storybook/angular";
import {withThemeByClassName} from "@storybook/addon-themes";

export const decorators: Decorator[] = [
  withThemeByClassName({
    themes: {
      light: 'light-theme',
      dark: 'dark-theme'
    },
    defaultTheme: 'light'
  })
];
