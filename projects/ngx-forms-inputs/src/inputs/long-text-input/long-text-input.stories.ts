import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LongTextInputComponent} from "./long-text-input.component";

export default {
  title: 'Inputs: Textarea',
  render: (args) => ({
    props: args,
    template: `<form-long-text-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Long text Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, LongTextInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
