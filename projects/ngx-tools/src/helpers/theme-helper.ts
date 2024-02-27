import {mostReadable, RGBA, TinyColor} from "@ctrl/tinycolor";

export namespace NgxTheme {

  export function ApplyTheme(element: HTMLElement, primaryColor: string, accentColor?: string) {
    applyThemeColor(element, primaryColor, 'primary');
    if (accentColor) applyThemeColor(element, accentColor, 'accent');
  }

  const contrastColors = [new TinyColor('#000000DD'), new TinyColor('#FFFFFFDD')];


  function applyThemeColor(element: HTMLElement, color: string, type: 'primary'|'accent') {

    element.style.setProperty(`--ngx-${type}`, color);
    const contrast = mostReadable(color, contrastColors)?.toHex8String() ?? '#000000DD';
    element.style.setProperty(`--ngx-${type}-contrast`, contrast);

    const palette = generatePalette(color);

    for (let c of palette) {
      element.style.setProperty(`--ngx-${type}-${c.name}`, c.color.toHex8String());
    }
  }


  function generatePalette(color: string) {
    const baseLight = new TinyColor('#ffffff');
    const instance = new TinyColor(color);
    const rgb = instance.toRgb();
    const baseDark = multiply(rgb, rgb);

    const colors = [
      {color: baseLight.mix(color, 30), name: '100'},
      {color: baseLight.mix(color, 50), name: '200'},
      {color: baseLight.mix(color, 70), name: '300'},
      {color: baseLight.mix(color, 85), name: '400'},
      {color: instance, name: '500'},
      {color: baseDark.mix(color, 87), name: '600'},
      {color: baseDark.mix(color, 70), name: '700'},
      {color: baseDark.mix(color, 54), name: '800'},
      {color: baseDark.mix(color, 25), name: '900'}
    ];

    for (let color of [...colors]) {
      colors.push({
        color: mostReadable(color.color, contrastColors) ?? contrastColors[0]!,
        name: `${color.name}-contrast`
      });
    }

    return colors;
  }

  function multiply(rgb1: RGBA, rgb2: RGBA){
    rgb1.b = Math.floor(Number(rgb1.b) * Number(rgb2.b) / 255);
    rgb1.g = Math.floor(Number(rgb1.g) * Number(rgb2.g) / 255);
    rgb1.r = Math.floor(Number(rgb1.r) * Number(rgb2.r) / 255);
    return new TinyColor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
  }
}
