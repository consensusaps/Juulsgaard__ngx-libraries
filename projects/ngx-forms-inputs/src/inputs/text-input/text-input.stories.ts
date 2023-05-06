import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TextInputComponent} from "./text-input.component";

export default {
  title: 'Inputs: Text',
  component: TextInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Text Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<TextInputComponent>;

export const Default: Story = {};
