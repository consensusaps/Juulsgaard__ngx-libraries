import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TextInputComponent} from "./text-input.component";

export default {
  title: 'Inputs: Text',
  render: (args) => ({
    props: args,
    template: `<form-text-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Text Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, TextInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
