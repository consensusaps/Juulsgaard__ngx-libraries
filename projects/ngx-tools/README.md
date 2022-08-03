# NgxTools


## Setup

When using the library make sure to import the styles from `/styles`, or import specific style files in the directory

If you want to customise the theming, then make sure to register custom theming values using `/theme` like so:

```scss
@use '@consensus-labs/ngx-tools/theme' as theme;

:root {
	@include theme.ngx-theme(
			$background: #F0F0F0,
			$foreground: #FCFCFC,
			$foreground-light: #FFFFFF,
			$text-color: #000000DD,
			$text-color-light: #00000099,
			$primary: mat.get-color-from-palette($my-primary, 700),
			$accent: mat.get-color-from-palette($my-accent, A400),
	);
}
```
