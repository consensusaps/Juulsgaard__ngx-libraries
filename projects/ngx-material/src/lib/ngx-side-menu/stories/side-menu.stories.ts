import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {SideMenuPreviewComponent} from "./side-menu-preview/side-menu-preview.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Side Menu',
  component: SideMenuPreviewComponent,
  args: {
    show: true
  },
  argTypes: {
    showChanged: {action: 'showChanged'},
    slugChanged: {action: 'slugChanged'},
    maxWidth: {type: 'number'}
  },
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<SideMenuPreviewComponent>;

export const Default: Story = {
  render: (args) => ({props: args})
};
