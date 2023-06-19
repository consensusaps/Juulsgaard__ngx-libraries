import {BoolInputComponent} from "./bool-input.component";
import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Bool',
  component: BoolInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Boolean Toggle',
    tooltip: 'Tooltip',
    disable: false
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [
    moduleMetadata({imports: [BrowserAnimationsModule]})
  ]
} satisfies Meta;

type Story = StoryObj<BoolInputComponent>;

export const Default: Story = {};
