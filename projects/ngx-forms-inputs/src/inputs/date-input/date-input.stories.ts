import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {DateInputComponent} from "./date-input.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Date',
  render: (args) => ({
    props: args,
    template: `<form-date-input ${argsToTemplate(args)}></form-date-input>`
  }),
  args: {
    label: 'Date Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, DateInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
