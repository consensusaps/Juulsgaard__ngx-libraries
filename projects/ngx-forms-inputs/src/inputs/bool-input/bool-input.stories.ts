import {BoolInputComponent} from "./bool-input.component";
import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Bool',
  render: (args: any) => ({
    props: args,
    template: `<form-bool-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Boolean Toggle',
    tooltip: 'Tooltip',
    disabled: false
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [
    moduleMetadata({imports: [BrowserAnimationsModule, BoolInputComponent]})
  ]
} satisfies Meta;

export const Default: StoryObj = {};
