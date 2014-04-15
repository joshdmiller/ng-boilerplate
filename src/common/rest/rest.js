(function() {
  'use strict';

  angular
  .module('rest',[])
  .factory('Rest', ['$http','$q', function($http, $q){

    var self;
    

    var Factory = function(baseUrl, options){
      this.baseUrl = baseUrl;
      this.options = options;


      this.url = function(resource){
        return this.baseUrl+resource;
      };
    };

    Factory.prototype.get = function(resource){

      var deferred = $q.defer();
      
      $http.get(this.url(resource),this.options).then(function(result){
        deferred.resolve(result.data);
      });

      return deferred.promise;
    };

    return Factory;
  }] );
})();