import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {ColorInputComponent} from "./color-input.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Inputs: Color',
  render: (args) => ({
    props: args,
    template: `<form-color-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Color Input',
    tooltip: 'Tooltip',
    withAlpha: false
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, ColorInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
