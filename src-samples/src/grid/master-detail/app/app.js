'use strict';

var app = angular.module('app',
                         ['ngResource', 
                          'igniteui-directives',]);

app.constant('localStorage', window.localStorage);