import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NumberInputComponent} from "./number-input.component";

export default {
  title: 'Inputs: Number',
  render: (args) => ({
    props: args,
    template: `<form-number-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Number Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, NumberInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
