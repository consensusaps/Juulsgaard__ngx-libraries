# NgxTools


## Setup

When using the library make sure to import the styles from `/styles/all.scss`, or import specific style files

If you want to customise the theming, then make sure to register custom theming values using `/styles/theme.scss` like so:

```scss
@use 'node_modules/@consensus-labs/ngx-tools/styles/theme' as theme;

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
