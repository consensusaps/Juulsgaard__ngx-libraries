import {Meta, moduleMetadata, StoryObj} from "@storybook/angular";
import {IconDirective} from "./icon.directive";

import {Component, Input} from '@angular/core';
import {IconProviderModule} from "../icon-provider.module";

@Component({
  selector: 'icon-preview',
  template: `<ngx-icon [icon]="icon" [alias]="alias" [padding]="padding" [size]="size"/>`,
  styleUrls: ['../../../../styles/_icons.scss'],
  styles: [`
      :host {
          position: absolute;
          display: flex;
          background-color: #949494;
          overflow: visible;
      }

      ngx-icon {
          background-color: #d5d5d5;
          background-clip: content-box;
      }
  `],
  standalone: true,
  imports: [IconDirective]
})
export class IconPreviewComponent {
  @Input() icon?: string;
  @Input() alias?: string;
  @Input() size?: string|number;
  @Input() padding?: string|number;
}

const meta: Meta = {
  title: 'Icon Directive',
  component: IconPreviewComponent,
  render: (args) => ({props: args}),
  argTypes: {
    size: {type: 'number', defaultValue: undefined},
    padding: {type: 'number', defaultValue: undefined},
  },
  args: {size: undefined, padding: undefined}
}

export default meta;
type Story = StoryObj<IconPreviewComponent>;

export const MaterialIcon: Story = {
  args: {icon: 'search'},
  decorators: [
    moduleMetadata({imports: [IconProviderModule.WithMaterial()]})
  ]
};

export const FontAwesomeIcon: Story = {
  args: {icon: 'fas fa-search'},
  decorators: [
    moduleMetadata({imports: [IconProviderModule.WithFontAwesome()]})
  ]
};

export const MaterialAlias: Story = {
  args: {alias: 'search'},
  decorators: [
    moduleMetadata({imports: [IconProviderModule.WithMaterial()]})
  ]
};

export const FontAwesomeAlias: Story = {
  args: {alias: 'search'},
  decorators: [
    moduleMetadata({imports: [IconProviderModule.WithFontAwesome()]})
  ]
};
