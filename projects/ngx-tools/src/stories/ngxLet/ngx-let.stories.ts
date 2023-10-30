import {Meta, StoryObj} from "@storybook/angular";
import {NgxLetPreviewComponent} from "./ngx-let-preview/ngx-let-preview.component";

export default {
  title: 'NGX Let',
  component: NgxLetPreviewComponent,
  render: (args) => ({props: args}),
  decorators: []
} satisfies Meta;

type Story = StoryObj<NgxLetPreviewComponent>;

export const Default: Story = {
  args: {}
};
