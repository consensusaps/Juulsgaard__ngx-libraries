import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SearchInputComponent} from "./search-input.component";

export default {
  title: 'Inputs: Search',
  render: (args) => ({
    props: args,
    template: `<form-search-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Search Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, SearchInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
