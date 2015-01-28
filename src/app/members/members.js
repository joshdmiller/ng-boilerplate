
angular
  .module('hermes.members',[])
  .config(function config( $stateProvider) {

    $stateProvider.state( 'members', {
      url: 'projects/{projectId}/members',
      views: {
        "main": {
          controller: 'MembersCtrl',
          templateUrl: 'members/members.tpl.html',
          controllerAs:'ctrl',
          resolve:{
            members:function($stateParams, Pivotal){
              return Pivotal.project($stateParams.projectId).members();
            },
            project:function($stateParams, Pivotal){
              return Pivotal.project($stateParams.projectId).get();
            }
          }
        }
      },
      data:{ pageTitle: 'Members' }
    });
})


.controller( 'MembersCtrl', function MembersController( members, project ) {
  this.members = members;
  this.project = project;
  
  var MD5 = new Hashes.MD5();

  angular.forEach(members, function(member){
    member.person.imageUrl = "http://www.gravatar.com/avatar/{md5}".supplant({md5:MD5.hex(member.person.email)});
  });

})

;