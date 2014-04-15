(function() {
  'use strict';

  angular
  .module('pivotal',['rest','apiConfig'])
  .factory('Pivotal', ['Rest','ApiConfig', function(Rest, ApiConfig){

    var base;
    var Factory = function(){
      this.apiToken = ApiConfig.pivotal.apiToken;
      this.rest = new Rest('https://www.pivotaltracker.com/services/v5/', {headers:{'X-TrackerToken':this.apiToken}});
      base = this;
    };

    Factory.prototype.projects = {
      all : function(){
        return base.rest.get('projects');
      },

      members : function(projectId){
        return base.rest.get('projects/{projectId}/memberships'.supplant({projectId:projectId}));
      }
    };


    Factory.prototype.project = function(projectId){
      this.projectId = projectId;

      this.members = function(){
        return base.rest.get('projects/{projectId}/memberships'.supplant({projectId:this.projectId}));
      };

      return this;
    };

    return new Factory();
  }] );
})();