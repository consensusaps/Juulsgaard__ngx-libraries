import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {DateInputComponent} from "./date-input.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Date',
  component: DateInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Date Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<DateInputComponent>;

export const Default: Story = {};
