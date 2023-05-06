import {Meta, StoryObj} from "@storybook/angular";
import {DialogPreviewComponent} from "./dialog-preview/dialog-preview.component";

export default {
  title: 'Dialog',
  component: DialogPreviewComponent,
  args: {
    show: true,
    header: 'Dialog Showcase',
    text: "This is a simple Dialog popup"
  },
  argTypes: {
    submit: {action: 'Submitted'}
  }
} satisfies Meta;

type Story = StoryObj<DialogPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
