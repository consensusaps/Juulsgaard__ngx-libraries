import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TimeInputComponent} from "./time-input.component";

export default {
  title: 'Inputs: Time',
  render: (args) => ({
    props: args,
    template: `<form-time-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Time Input',
    tooltip: 'Tooltip',
    value: new Date()
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, TimeInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
