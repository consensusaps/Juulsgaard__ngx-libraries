import {argsToTemplate, Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormPreviewComponent} from "./form-preview/form-preview.component";

export default {
  title: 'Form',
  render: (args: any) => ({
    props: args,
    template: `<ngx-form-preview ${argsToTemplate(args)}/>`
  }),
  decorators: [
    moduleMetadata({imports: [BrowserAnimationsModule, FormPreviewComponent]})
  ]
} satisfies Meta;

export const Default: StoryObj = {};
