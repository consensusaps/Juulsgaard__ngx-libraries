import {Meta, StoryObj} from "@storybook/angular";
import {LoadingOverlayComponent} from "./loading-overlay.component";

export default {
  title: 'Loading Overlay',
  component: LoadingOverlayComponent,
} satisfies Meta;

type Story = StoryObj<LoadingOverlayComponent>;

export const AbsoluteOverlay: Story = {
  render: (args) => ({props: {...args, type: 'absolute'}})
};
