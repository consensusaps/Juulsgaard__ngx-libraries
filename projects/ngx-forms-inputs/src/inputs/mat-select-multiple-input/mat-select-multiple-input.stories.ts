import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectMultipleInputComponent} from "./mat-select-multiple-input.component";

export default {
  title: 'Inputs: Multi Select',
  render: (args) => ({
    props: args,
    template: `<form-mat-select-multiple clearable ${argsToTemplate(args)}/>`
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
    imports: [BrowserAnimationsModule, MatSelectMultipleInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
