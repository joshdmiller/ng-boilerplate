(function() {
  'use strict';

  angular
  .module('apiConfig',[])
  .constant('ApiConfig', {
    'pivotal':{
      apiToken:'3e511ae6b1a062939bef4748fe725bd1'
    }, 
    'github':{
      accessToken:'5c395d3b298f77c9b1cca7cdc266fdf19ca97b1f'
    }
  } );
})();