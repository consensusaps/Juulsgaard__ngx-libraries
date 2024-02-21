import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FileInputComponent} from "./file-input.component";

export default {
  title: 'Inputs: File',
  render: (args) => ({
    props: args,
    template: `<form-file-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'File Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, FileInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
