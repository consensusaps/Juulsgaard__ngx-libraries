import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {HeadersPreviewComponent} from "./headers-preview/headers-preview.component";
import {UIScopeConfig, UIScopeContext} from "../../models/ui-scope";
import {RouterTestingModule} from "@angular/router/testing";

const defaultConfig: UIScopeConfig = {
  default: {
    showMenu: true,
    class: 'main',
    child: {
      class: 'sub',
      tabScope: {
        class: 'tab',
        child: {
          class: 'sub-tab'
        }
      }
    }
  }
}

export default {
  title: 'Headers',
  component: HeadersPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({
      providers: [UIScopeContext.Provide(defaultConfig)],
      imports: [RouterTestingModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<HeadersPreviewComponent>;

export const Default: Story = {};
