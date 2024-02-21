import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DateTimeInputComponent} from "./date-time-input.component";

export default {
  title: 'Inputs: Date Time',
  render: (args) => ({
    props: args,
    template: `<form-date-time-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Date Time Input',
    tooltip: 'Tooltip',
    value: new Date()
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, DateTimeInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
