var app = angular.module('TarPredApp', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider, $locationProvider) {
    if (window.history && history.pushState){
        $locationProvider.html5Mode(true);
    }
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController'
    }).when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'signupController'
    }).when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'signinController'
    }).when('/create', {
        templateUrl: 'views/create.html',
        controller: 'createController'
    }).when('/view', {
        templateUrl: 'views/view.html',
        controller: 'viewController'
    }).otherwise({
        redirectTo: '/'
    });
});

