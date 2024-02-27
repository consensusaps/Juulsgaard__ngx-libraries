import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {DialogPreviewComponent} from "./dialog-preview/dialog-preview.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Dialog',
  component: DialogPreviewComponent,
  args: {
    show: true,
    showDirective: false,
    canClose: true,
    header: 'Dialog Showcase',
    text: "This is a simple Dialog popup"
  },
  argTypes: {
    submit: {action: 'Submitted'}
  },
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<DialogPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
