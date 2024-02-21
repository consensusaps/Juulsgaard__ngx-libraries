import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PasswordInputComponent} from "./password-input.component";

export default {
  title: 'Inputs: Password',
  render: (args) => ({
    props: args,
    template: `<form-password-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Password Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, PasswordInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
