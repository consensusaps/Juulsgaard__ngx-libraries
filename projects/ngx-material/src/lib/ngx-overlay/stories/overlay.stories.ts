import {OverlayPreviewComponent} from "./overlay-preview/overlay-preview.component";
import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

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
  },
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<OverlayPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
