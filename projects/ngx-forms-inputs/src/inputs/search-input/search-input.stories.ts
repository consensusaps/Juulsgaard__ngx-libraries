import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SearchInputComponent} from "./search-input.component";

export default {
  title: 'Inputs: Search',
  component: SearchInputComponent,
  render: (args) => ({props: args}),
  args: {
    label: 'Search Input',
    tooltip: 'Tooltip'
  },
  argTypes: {
    valueChange: {action: 'Value Changed'}
  },
  decorators: [moduleMetadata({
    imports: [BrowserAnimationsModule]
  })]
} satisfies Meta;

type Story = StoryObj<SearchInputComponent>;

export const Default: Story = {};
