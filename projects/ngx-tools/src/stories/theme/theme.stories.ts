import {Meta, StoryObj} from "@storybook/angular";
import {ThemePreviewComponent} from "./theme-preview/theme-preview.component";

export default {
  title: 'Theme',
  component: ThemePreviewComponent,
  render: (args) => ({props: args}),
  decorators: []
} satisfies Meta;

type Story = StoryObj<ThemePreviewComponent>;

export const LightTheme: Story = {
  args: {light: true}
};

export const DarkTheme: Story = {
  args: {dark: true}
};

