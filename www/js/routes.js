angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('menu', {
      url: '/side-menu',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
    .state('menu.login', {
      url: '/login',
      views: {
        'side-menu21': {
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
    })
    .state('menu.signup', {
      url: '/signup',
      views: {
        'side-menu21': {
          templateUrl: 'templates/signup.html',
          controller: 'signupCtrl'
        }
      }
    })
    .state('menu2', {
      cache: false,
      url: '/side-menu2',
      abstract:true,
      templateUrl: 'templates/menu2.html',
      controller:'menu2Ctrl'
    })
    .state('menu2.theApp', {
      url: '/theApp/:username',
      views: {
        'tab1': {
          templateUrl: 'templates/theApp.html',
          controller: 'theAppCtrl'
        }
      }
    })
    .state('menu2.canvas', {
      url: '/canvas/:username',
      views: {
        'tab2': {
          templateUrl: 'templates/canvas.html',
          controller: 'canvasCtrl'
        }
      }
    })
    .state('menu2.account', {
      url: '/account/:username',
      views: {
        'tab3': {
          templateUrl: 'templates/account.html',
          controller: 'accountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/side-menu/login');

});
