# Angular Libraries

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Getting started

In order to be able to publish the NPM package you will need to add your GitLab API token (API Access) via the following command

```cmd
npm config set -- //gitlab.com/api/v4/projects/38278038/packages/npm/:_authToken $AUTH_TOKEN$
```

Where `$AUTH_TOKEN$` is your GitLab API token

You will also need to add the following for package download:

```cmd
npm config set -- //gitlab.com/api/v4/packages/npm/:_authToken $AUTH_TOKEN$
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
