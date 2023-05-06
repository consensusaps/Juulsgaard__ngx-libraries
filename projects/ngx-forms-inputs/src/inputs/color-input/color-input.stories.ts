import {Meta, StoryObj} from "@storybook/angular";
import {ColorInputComponent} from "./color-input.component";

export default {
  title: 'Inputs: Color',
  component: ColorInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Color Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  }
} satisfies Meta;

type Story = StoryObj<ColorInputComponent>;

export const Default: Story = {};
