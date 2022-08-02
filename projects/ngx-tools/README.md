# NgxTools


## Setup

When using the library make sure to import the styles from `/styles/all.scss`, or import specific style files

If you want to customise the theming, then make sure to register custom theming values using `/styles/theme.scss` like so:

```scss
@use 'node_modules/@consensus-labs/ngx-tools/styles/theme' as theme;

:root {
	@include theme.ngx-theme(
			$background: #f0f0f0,
			$overlay: #FCFCFC,
			$text-color: #000000DD,
			$text-color-light: #00000099
	);
}
```
