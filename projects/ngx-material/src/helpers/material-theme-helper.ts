import {mostReadable, RGBA, TinyColor} from "@ctrl/tinycolor";

export namespace MaterialTheme {

  export function ApplyTheme(element: HTMLElement, primaryColor: string, accentColor?: string) {
    applyThemeColor(element, primaryColor, 'primary');
    if (accentColor) applyThemeColor(element, accentColor, 'accent');
  }

  const contrastColors = [new TinyColor('#000000DD'), new TinyColor('#FFFFFFDD')];


  function applyThemeColor(element: HTMLElement, color: string, type: 'primary'|'accent') {
    const palette = generatePalette(color);
    for (let c of palette) {
      element.style.setProperty(`--theme-${type}-${c.name}`, c.color.toHex8String());
    }
  }


  function generatePalette(color: string) {
    const baseLight = new TinyColor('#ffffff');
    const baseDark = multiply(new TinyColor(color).toRgb(), new TinyColor(color).toRgb());
    const baseTriad = new TinyColor(color).tetrad();
    const colors: {color: TinyColor, name: string}[] = [
      {color: baseLight.mix(color, 12), name: '50'},
      {color: baseLight.mix(color, 30), name: '100'},
      {color: baseLight.mix(color, 50), name: '200'},
      {color: baseLight.mix(color, 70), name: '300'},
      {color: baseLight.mix(color, 85), name: '400'},
      {color: baseLight.mix(color, 100), name: '500'},
      {color: baseDark.mix(color, 87), name: '600'},
      {color: baseDark.mix(color, 70), name: '700'},
      {color: baseDark.mix(color, 54), name: '800'},
      {color: baseDark.mix(color, 25), name: '900'},
      {color: baseDark.mix(baseTriad[3]!, 15).saturate(80).lighten(65), name: 'A100'},
      {color: baseDark.mix(baseTriad[3]!, 15).saturate(80).lighten(55), name: 'A200'},
      {color: baseDark.mix(baseTriad[3]!, 15).saturate(100).lighten(45), name: 'A400'},
      {color: baseDark.mix(baseTriad[3]!, 15).saturate(100).lighten(40), name: 'A700'}
    ];

    for (let color of [...colors]) {
      colors.push({
        color: mostReadable(color.color, contrastColors) ?? contrastColors[0]!,
        name: `contrast-${color.name}`
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
