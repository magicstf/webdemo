/**
 * Created by tengfeisu on 2016/2/18.
 */
'use strict';

var angularDemo = angular.module('angularDemo', []);
angularDemo.controller('PhoneListCtrl', function ($scope) {
    $scope.phones = [{ "name": "Nexus S",
        "snippet": "Fast just got faster with Nexus S." }, { "name": "Motorola XOOM™ with Wi-Fi",
        "snippet": "The Next, Next Generation tablet." }, { "name": "MOTOROLA XOOM™",
        "snippet": "The Next, Next Generation tablet." }];
    $scope.hello = 'hello world!';
    $scope.orderProp = 'age';
});