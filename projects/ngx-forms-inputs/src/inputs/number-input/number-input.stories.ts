import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NumberInputComponent} from "./number-input.component";

export default {
  title: 'Inputs: Number',
  component: NumberInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Number Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<NumberInputComponent>;

export const Default: Story = {};
