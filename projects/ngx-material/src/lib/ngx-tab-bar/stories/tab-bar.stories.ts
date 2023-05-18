import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {TabBarPreviewComponent} from "./tab-bar-preview/tab-bar-preview.component";
import {NgxNavTabBarModule} from "../ngx-nav-tab-bar.module";
import {RouterTestingModule} from "@angular/router/testing";

export default {
  title: 'Tab Bar',
  component: TabBarPreviewComponent,
  render: (args) => ({props: args}),
  decorators: [
    moduleMetadata({
      imports: [NgxNavTabBarModule, RouterTestingModule]
    })
  ]
} satisfies Meta;

type Story = StoryObj<TabBarPreviewComponent>;

export const Default: Story = {};
