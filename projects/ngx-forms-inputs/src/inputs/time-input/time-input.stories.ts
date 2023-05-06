import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TimeInputComponent} from "./time-input.component";

export default {
  title: 'Inputs: Time',
  component: TimeInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Time Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<TimeInputComponent>;

export const Default: Story = {};
