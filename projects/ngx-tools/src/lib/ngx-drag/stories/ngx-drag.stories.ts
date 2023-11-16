import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxDragPreviewComponent} from "./ngx-drag-preview/ngx-drag-preview.component";

export default {
  title: 'Drag & Drop',
  component: NgxDragPreviewComponent,
  args: {

  },
  argTypes: {

  },
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<NgxDragPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
