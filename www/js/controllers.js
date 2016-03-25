angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, $state, $http, $rootScope, $ionicLoading) {
  $scope.mainData = {};
  $scope.login = function() {
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0,
    template: '<ion-spinner icon="spiral"></ion-spinner>'
  });
    $scope.message = '';
      $http.post('http://ionic-restful-api.herokuapp.com/login', {
      //$http.post('http://localhost:5000/login', {
              username: $scope.mainData.username,
              password: $scope.mainData.password
          })
          .success(function(user) {
            console.log(user.username);
              if (user.username == $scope.mainData.username) {
                  $rootScope.username = user.username;
                  $rootScope.password = user.password;
                  console.log('rootscope.password: ' + $rootScope.password);
                  console.log('user.password: ' + user.password);
                  $state.go('menu2.theApp',{username: user.username});
              } else {
                  $ionicLoading.hide();
                  $scope.message = 'Bad username or password.';
              }
          })
          .error(function() {
              $ionicLoading.hide();
              $state.go('menu.signup');
          });
  };
})
.controller('signupCtrl', function($scope, $http, $ionicLoading) {
  $scope.mainData = {};
  $scope.signup = function(){
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0,
    template: '<ion-spinner icon="spiral"></ion-spinner>'
  });
    $scope.message = '';
    $http.post('http://ionic-restful-api.herokuapp.com/signup', {
    //$http.post('http://localhost:5000/signup', {
            username: $scope.mainData.username,
            password: $scope.mainData.password,
            email: $scope.mainData.email
        })
        .success(function(user) {
            if (user.username == $scope.mainData.username) {
                $ionicLoading.hide();
                $scope.message = $scope.mainData.username + ' added.';
            } else {
                $ionicLoading.hide();
                $scope.message = 'This username is used by someone else!';
            }
        })
        .error(function() {
            $ionicLoading.hide();
            $scope.message = 'Error?!';
        });
  }
})

.controller('menu2Ctrl', function($scope, $rootScope){
  console.log('$rootScope.username: ' + $rootScope.username);
  $scope.username = $rootScope.username;
})

.controller('canvasCtrl', function($scope, $state, $stateParams, $rootScope, $ionicLoading, $http) {
  $ionicLoading.hide();
  $scope.mainData = {};
  $scope.username = $stateParams.username;
  var canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-220;
  var ctx = canvas.getContext("2d");
  var clicked = false;
  var mparray = [];
  var pushSendButton = 1;
  var socket = io.connect("http://ionic-restful-api.herokuapp.com");
  //var socket = io.connect("http://localhost:5000");
  socket.on('connect', function(){
    var socketId = socket.io.engine.id;
    $http.post('http://ionic-restful-api.herokuapp.com/getUserDetails',
    //$http.post('http://localhost:5000/getUserDetails',
    {username: $rootScope.username, password: $rootScope.password})
    .success(function(user) {
              socket.emit('sendInformation', {socketId: socketId, name: user.username})
          })
          .error(function() {
            $rootScope.username = '';
            $state.go('menu.login');
          });

  });
  $scope.erase = function(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    mparray = [];
  }
  $scope.send = function(){
    pushSendButton = 1;
    console.log($scope.mainData.friendName);
    socket.emit("send_mouse_pos",{friendName: $scope.mainData.friendName, mouse_pos:mparray, senderName: $rootScope.username});
  }
  canvas.addEventListener("touchstart", function tik(event) {
    if(pushSendButton == 1){
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      mparray = [];
      pushSendButton = 0;
    }
    var mousePos = getTouchPos(event);
        clicked = true;
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        mparray.push(mousePos.x/ canvas.width,mousePos.y/canvas.height);
});
canvas.addEventListener("touchend", function tik(event) {
    clicked = false;
    ctx.closePath();
    mparray.push(999);
    mparray.push(999);
});
canvas.addEventListener("touchmove", function tik(event) {
    var mousePos = getTouchPos(event);
        if (clicked) {
            mparray.push(mousePos.x/ canvas.width,mousePos.y/canvas.height);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
        }
});
function getTouchPos(evt) {
            var touchobj = evt.changedTouches[0]
            return {
                x: touchobj.clientX - 10 ,
                y: touchobj.clientY - 120
            };
        }
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 250;
    }

    socket.on('send_draw', function (data) {
      console.log('send_draw ' + data.senderName);
      $scope.$apply(function(){
        $scope.mainData.fromName = data.senderName;
      });
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000000";
      mparray = [];
                ctx.beginPath();
                ctx.moveTo(((data.drawarray[0]*canvas.width)-1), ((data.drawarray[1]*canvas.height)-1));

                for(var i = 0;i<(data.drawarray).length;i+=2){
                    if(data.drawarray[i] == 999){
                        ctx.closePath();
                        ctx.moveTo(((data.drawarray[i+2]*canvas.width)-1), ((data.drawarray[i+3]*canvas.height)-1));
                        ctx.beginPath();
                        continue;
                    }
                    ctx.lineTo((data.drawarray[i]*canvas.width), (data.drawarray[i+1]*canvas.height));
                    ctx.stroke();
                }
                ctx.closePath();
                //socket.emit("message_sent",{sentuserid:data.userid});
            });
})
.controller('theAppCtrl', function($scope, $state, $stateParams, $rootScope, $ionicLoading) {
  $ionicLoading.hide();
  $scope.username = $stateParams.username;
  $scope.logout = function(){
    $rootScope.username = '';
    $state.go('menu.login');
  };
})
.controller('accountCtrl', function($scope, $stateParams, $ionicLoading, $http, $rootScope, $state) {
  $ionicLoading.hide();
  $scope.mainData = {};
  $http.post('http://ionic-restful-api.herokuapp.com/getUserDetails',
  //$http.post('http://localhost:5000/getUserDetails',
  {username: $rootScope.username, password: $rootScope.password})
  .success(function(user) {
            $scope.mainData.username = user.username;
            $scope.mainData.password = user.password;
            $scope.mainData.email = user.email;
        })
        .error(function() {
          $rootScope.username = '';
          $state.go('menu.login');
        });
})
