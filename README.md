
# LiveCovid19.org is a Live Covid-19 Tracker
Helping Communities to Track COVID-19 Cases across India and World.

[Live Version](https://www.livecovid19.org/) | [Developed By InverseSoft](https://www.inversesoft.com)


This repository contains a source code opened for contributors to help development of [livecovid19.org](https://www.livecovid19.org).

## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of COVID-19 India Dashboard on your local machine by running:

```shell
$ git clone https://github.com/abhiways/livecovid19.git MyApp
$ cd MyApp
```

#### 2. Run `npm install && bower install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file. We are moving all dependencies to npm, so there will be no bower dependencies soon.

Note: While installation if compiler asked about select2 version your answer sould be 2

#### 3. Run `npm install -g grunt`

This commant will install grunt task runner globally.

#### 4. Run `grunt`

This command will build the app from the source files (`/src`) into the output
`/dist` folder. 

#### 5. Run `grunt watch`
This command will watch for changes in `/src` and recompile handlebars' templates & scss styles on the fly into html & css accordingly.

#### 5. Run `http-server ./dist`
This command will serve `/dist` folder and you can watch local version of website in your browser.
`http://127.0.0.1:8080` OR `http://localhost:8080`

Note: socket polling will not work on your local environment.

## Technologies

- React
- Node.js
- Socket.io
- Bootstrap & SCSS 
- jQuery


## Support
For any additional information or contribute apart from development [Email Us](mailto:livecovid19org@gmail.com).

## How can I support developers?
- Star our GitHub repo :star:
- [Tweet about it](https://twitter.com/intent/tweet?text=LiveCovid19.org%20LIVE%20COVID-19%20Tracker%20India!&url=https://www.livecovid19.org/).
- Create pull requests, submit/fix bugs, develop new modules and add new features or documentation updates :wrench:
- Follow [@abhiways on Twitter](https://twitter.com/abhiways).
- Like our page on [Facebook](https://www.facebook.com/inversesoft/) :thumbsup:

## Software / Web / Mobile App Development
Looking for custom developmet? Check out our website at [inversesoft.com](https://www.inversesoft.com).

## License

Source Code of livecovid19.org is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](http://creativecommons.org/licenses/by-nc/4.0/)
