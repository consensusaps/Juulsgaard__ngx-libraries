import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DateTimeInputComponent} from "./date-time-input.component";

export default {
  title: 'Inputs: Date Time',
  component: DateTimeInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Date Time Input',
    tooltip: 'Tooltip',
    value: new Date()
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<DateTimeInputComponent>;

export const Default: Story = {};
