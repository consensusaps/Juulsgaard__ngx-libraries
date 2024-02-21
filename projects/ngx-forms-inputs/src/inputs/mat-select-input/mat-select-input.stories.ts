import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectInputComponent} from "./mat-select-input.component";

export default {
  title: 'Inputs: Select',
  render: (args) => ({
    props: args,
    template: `<form-mat-select clearable ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Mat Select',
    tooltip: 'Tooltip',
    items: ["First", "Second", "Third"]
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, MatSelectInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
