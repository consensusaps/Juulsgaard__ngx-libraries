import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {ColorInputComponent} from "./color-input.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Color',
  component: ColorInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Color Input',
    tooltip: 'Tooltip',
    withAlpha: false
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<ColorInputComponent>;

export const Default: Story = {};
