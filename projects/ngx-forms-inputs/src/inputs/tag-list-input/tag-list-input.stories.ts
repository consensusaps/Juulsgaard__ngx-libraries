import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TagListInputComponent} from "./tag-list-input.component";

export default {
  title: 'Inputs: Tag List',
  render: (args) => ({
    props: args,
    template: `<form-tag-list-input ${argsToTemplate(args)}/>`
  }),
  args: {
    label: 'Tag List Input',
    placeholder: 'Add Tag',
    tooltip: '',
    value: ['Tag1', 'Tag Two'],
    items: ['Tag1', 'Option 2', 'Third Option']
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule, TagListInputComponent]
  })]
} satisfies Meta;

export const Default: StoryObj = {};
