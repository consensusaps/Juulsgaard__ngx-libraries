import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {SnackbarPreviewComponent} from "./snackbar-preview/snackbar-preview.component";
import {NgxSnackbarModule} from "../ngx-snackbar.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Snackbars',
  component: SnackbarPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({
      imports: [NgxSnackbarModule, BrowserAnimationsModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<SnackbarPreviewComponent>;

export const ErrorMessage: Story = {};
