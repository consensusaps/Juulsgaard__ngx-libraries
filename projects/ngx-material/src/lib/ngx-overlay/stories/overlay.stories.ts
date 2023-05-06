import {OverlayPreviewComponent} from "./overlay-preview/overlay-preview.component";
import {Meta, StoryObj} from "@storybook/angular";

export default {
  title: 'Overlay',
  component: OverlayPreviewComponent,
  args: {
    show: true,
    content: "This is a simple Dialog popup"
  },
  argTypes: {
    closed: {action: 'Closed'},
    maxWidth: {type: 'number'}
  }
} satisfies Meta;

type Story = StoryObj<OverlayPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
