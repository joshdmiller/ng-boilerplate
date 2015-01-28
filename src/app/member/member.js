
angular
  .module('hermes.member',[])
  .config(function config( $stateProvider) {

    $stateProvider.state( 'member', {
      url: 'projects/{projectId}/member/{memberId}',
      views: {
        "main": {
          controller: 'MemberCtrl',
          templateUrl: 'member/member.tpl.html',
          controllerAs:'ctrl',
          resolve:{
            project:function($stateParams, Pivotal){
              return Pivotal.project($stateParams.projectId).get();
            }, 
            query:function($stateParams, Pivotal){
              return Pivotal.member($stateParams.projectId, $stateParams.memberId).stories();
            },
            member:function($stateParams, Pivotal){
              return Pivotal.member($stateParams.projectId, $stateParams.memberId).get();
            }
          }
        }
      },
      data:{ pageTitle: 'Member' }
    });
})


.controller( 'MemberCtrl', function MemberController( $stateParams, project, query, Pivotal, member) {
    this.project  = project;
    this.query    = query;
    this.member   = member;
    this.stats    = {
      types:{
        bug:0,
        chore:0,
        feature:0
      },
      states:{
        delivered:0,
        finished:0,
        planned:0,
        unscheduled:0,
        unstarted:0
      }
    };

    var self      = this;
    this.show = {
      description : false
    };

    this.showDescriptions = function(){
      this.show.description = !this.show.description;
    };

    angular.forEach(this.query.stories.stories,function(story){
      self.stats.types[story.story_type]+=1;
      self.stats.states[story.current_state]+=1;
    });
    
    self.stats.states.unstartedTotal = self.stats.states.unstarted + self.stats.states.planned + self.stats.states.unscheduled;

    this.query.done   = query.stories.total_hits_with_done - query.stories.total_hits;
    this.query.total  = query.stories.total_hits_with_done + query.stories.total_hits;
})

;
