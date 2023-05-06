import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FileInputComponent} from "./file-input.component";

export default {
  title: 'Inputs: File',
  component: FileInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'File Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<FileInputComponent>;

export const Default: Story = {};
