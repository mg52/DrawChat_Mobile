Draw Chat Mobile App

This is my sample mobile app with Ionic Framework with Login/Sign Up handler and also Socket.io to handle sending/receiving drawings.

This app uses my RESTful API that controls the login/sign up requests and controls Socket.io server. 
The RESTful API: https://github.com/mg52/ionic_RESTful_API 

To run locally:

$ npm install -g cordova

$ npm install -g ionic

Then download the repository, cd to the app directory;
To run on your browser: 

$ ionic serve

Or run on an emulator:

$ ionic platform add ios

$ ionic platform add android

then 

$ ionic build ios

$ ionic emulate ios

