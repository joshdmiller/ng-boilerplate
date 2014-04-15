#
Hermes - An AngularJS dashboard for [Pivotal Tracker](https://www.pivotaltracker.com/)

***

## Configuration

Configuring Pivotal and Github in Hermes, is quiet easy, you just need to create a constant `HermesConfig` 
```js

(function() {
    'use strict';

    angular
        .module('hermes.config',[])
        .constant('HermesConfig', {
            'pivotal':{
                apiToken:'xxxxxxx'
            }, 
            'github':{
                accessToken:'xxxxxxxxxxx'
            }
    } );
})();


```

And place it in `/src/app/config/config.js` 

## Run

`grunt build`
