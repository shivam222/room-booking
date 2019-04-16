# RoomBooking

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Structure of project

In root dir we have server file(express server), models folder which describes the structure of mongodb tables, server folder contains a lib and a routes folder.
lib folder contains file which have common function to be used by routes folder.routes folder contains route based handling of each request from the front-end.
In src/app folder lies the angular code.

## How to run server

To run angular server type ng serve
To run node server type nodemon server
To run mongodb server-> Go to C:/Program Files/Mongodb/3.2/bin/mongodb

## Compile angular code

Before running node server its important to run ng build to compile new changes of angular code.

## Create new ang component

Type ng g c name --module=app.module

## Create a service

Type ng g s services/name --module=app.module

## Module Files

app.module - main module files containg all services and components
app-routing.module - in this module we define links to each component
material.module - in this module we register all angular material components being used
