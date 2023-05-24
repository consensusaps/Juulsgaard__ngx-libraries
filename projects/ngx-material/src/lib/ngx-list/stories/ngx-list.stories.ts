import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {NgxListPreviewComponent} from "./ngx-list-preview/ngx-list-preview.component";

export default {
  title: 'Lists',
  component: NgxListPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({
      imports: []
    })
  ]
} satisfies Meta;

type Story = StoryObj<NgxListPreviewComponent>;

export const Default: Story = {};
