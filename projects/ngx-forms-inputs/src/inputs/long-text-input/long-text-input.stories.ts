import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LongTextInputComponent} from "./long-text-input.component";

export default {
  title: 'Inputs: Textarea',
  component: LongTextInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Long text Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<LongTextInputComponent>;

export const Default: Story = {};
