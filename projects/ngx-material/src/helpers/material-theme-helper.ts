import tinycolor from "tinycolor2";
import RGBA = tinycolor.ColorFormats.RGBA;

export namespace MaterialTheme {

  export function ApplyTheme(element: HTMLElement, primaryColor: string, accentColor?: string) {
    applyThemeColor(element, primaryColor, 'primary');
    if (accentColor) applyThemeColor(element, accentColor, 'accent');
  }

  const contrastColors = [tinycolor('#000000DD'), tinycolor('#FFFFFFDD')];


  function applyThemeColor(element: HTMLElement, color: string, type: 'primary'|'accent') {
    const palette = generatePalette(color);
    for (let c of palette) {
      element.style.setProperty(`--theme-${type}-${c.name}`, c.color.toHex8String());
    }
  }


  function generatePalette(color: string) {
    const baseLight = tinycolor('#ffffff');
    const baseDark = multiply(tinycolor(color).toRgb(), tinycolor(color).toRgb());
    const baseTriad = tinycolor(color).tetrad();
    const colors = [
      {color: tinycolor.mix(baseLight, color, 12), name: '50'},
      {color: tinycolor.mix(baseLight, color, 30), name: '100'},
      {color: tinycolor.mix(baseLight, color, 50), name: '200'},
      {color: tinycolor.mix(baseLight, color, 70), name: '300'},
      {color: tinycolor.mix(baseLight, color, 85), name: '400'},
      {color: tinycolor.mix(baseLight, color, 100), name: '500'},
      {color: tinycolor.mix(baseDark, color, 87), name: '600'},
      {color: tinycolor.mix(baseDark, color, 70), name: '700'},
      {color: tinycolor.mix(baseDark, color, 54), name: '800'},
      {color: tinycolor.mix(baseDark, color, 25), name: '900'},
      {color: tinycolor.mix(baseDark, baseTriad[3], 15).saturate(80).lighten(65), name: 'A100'},
      {color: tinycolor.mix(baseDark, baseTriad[3], 15).saturate(80).lighten(55), name: 'A200'},
      {color: tinycolor.mix(baseDark, baseTriad[3], 15).saturate(100).lighten(45), name: 'A400'},
      {color: tinycolor.mix(baseDark, baseTriad[3], 15).saturate(100).lighten(40), name: 'A700'}
    ];

    for (let color of [...colors]) {
      colors.push({
        color: tinycolor.mostReadable(color.color, contrastColors),
        name: `contrast-${color.name}`
      });
    }

    return colors;
  }

  function multiply(rgb1: RGBA, rgb2: RGBA){
    rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
    rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
    rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);
    return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
  }

}
