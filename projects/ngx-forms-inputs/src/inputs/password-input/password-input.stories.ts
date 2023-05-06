import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PasswordInputComponent} from "./password-input.component";

export default {
  title: 'Inputs: Password',
  component: PasswordInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Password Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<PasswordInputComponent>;

export const Default: Story = {};
