import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSelectInputComponent} from "./mat-select-input.component";

export default {
  title: 'Inputs: Select',
  component: MatSelectInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Mat Select',
    tooltip: 'Tooltip',
    items: ["First", "Second", "Third"]
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<MatSelectInputComponent<string, string>>;

export const Default: Story = {};
