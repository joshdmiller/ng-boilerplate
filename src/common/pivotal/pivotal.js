(function() {
  'use strict';

  angular
  .module('pivotal',['rest','apiConfig'])
  .factory('Pivotal', ['$q', 'Rest','ApiConfig', function($q, Rest, ApiConfig){

    var base;
    var localMembers = [];

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
        var deferred = $q.defer();
        base.rest.get('projects/{projectId}/memberships'.supplant({projectId:this.projectId})).then(function(members){

          // We have to save the members, because there is no way to get information about one single person :(
          localMembers = members;

          deferred.resolve(members);
        });

        return deferred.promise;
      };

      this.get = function(){
        return base.rest.get('projects/{projectId}'.supplant({projectId:this.projectId}));
      };

      return this;
    };

    Factory.prototype.member = function(projectId, memberId){
      this.memberId = memberId;
      this.projectId = projectId;

      this.stories = function(){
        return base.rest.get('projects/{projectId}/search?query=owner:{memberId}'.supplant({projectId:this.projectId,memberId:memberId}));
      };

      this.currentStories = function(){
        return base.rest.get('projects/{projectId}/search?query=owner:{memberId} -includedone:true'.supplant({projectId:this.projectId,memberId:memberId}));
      };

      this.get = function(){
        var self = this;
        var memberFound = false;
        var deferred = $q.defer();

        angular.forEach(localMembers,function(member){
          if ( member.person.id == self.memberId){
            if ( !angular.isDefined(member.imageUrl)){
              member.person.imageUrl = Utils.prototype.getGravatarImageUrl(member.person.email);
            }

            deferred.resolve(member);
            return;
          }
        });

        return deferred.promise;

      };

      return this;
    };

    return new Factory();
  }] );
})();