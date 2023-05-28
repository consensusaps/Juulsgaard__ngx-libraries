import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {ButtonPreviewComponent} from "./button-preview/button-preview.component";

export default {
  title: 'Buttons',
  component: ButtonPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({})
  ]
} satisfies Meta;

type Story = StoryObj<ButtonPreviewComponent>;

export const Default: Story = {};
