import {BoolInputComponent} from "./bool-input.component";
import {Meta, StoryObj} from "@storybook/angular";

export default {
  title: 'Inputs: Bool',
  component: BoolInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Boolean Toggle',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  }
} satisfies Meta;

type Story = StoryObj<BoolInputComponent>;

export const Default: Story = {};
