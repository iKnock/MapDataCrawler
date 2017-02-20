'use strict';

angular.module('myApp', [
    'nemLogging',
    'ui-leaflet',
    'angularFileUpload',
    'toaster',
    'plotly',
    'ngResource',
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'myApp.controllers',
    'myApp.restServices'
]).config(['$routeProvider',
    function ($routeProvider) {
    $routeProvider.when('/essMap', {templateUrl: '/partials/ess-map.html', controller: 'EssMapCtrl', preload: true});
    $routeProvider.otherwise({redirectTo: '/essMap'});
}]);//end of config