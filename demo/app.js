/**
 * Created by stevegentile on 12/18/14.
 */
(function (){
  'use strict';

  angular.module('myApp', [
    'ngSanitize',
    'ngMessages',
    'toggle-switch',
    'sds-angular-controls'
  ]);

  angular.module('myApp').controller("DemoCtrl", function($timeout) {
    var vm = this;

    vm.masterTestForm = {
      FirstName: "",
      LastName: "Gentile",
      Email: "",
      PhoneNumber: "",
      Age: 25,
      City: "",
      State: "",
      ZipCode: "",
      Price:  5.983,
      LikesIceCream: false,
      DateOfBirth : null,
      weight: 100,
      weightUnit: true
    };

    vm.testForm = angular.copy(vm.masterTestForm);


    vm.states = [
      {stateCode: "OH", stateName: "Ohio"},
      {stateCode: "IN", stateName: "Indiana"},
      {stateCode: "MI", stateName: "Michigan"}
    ];
    vm.itemList = [];

    vm.save = function(testFrm){
      debugger;
      if(!testFrm.$invalid) {
        vm.itemList.push(vm.testForm);
        vm.testForm = angular.copy(vm.masterTestForm);
        testFrm.$setPristine(true);
        testFrm.$setDirty(false);
      }
    };

    /* Grid */

    vm.gridItems = [
      {name: 'david', age: 99}
    ];

    $timeout(function (){
      vm.gridItems = [
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25},
        {name: 'Michael', age: 30},
        {name: 'George Michael', age: 15},
        {name: 'Oscar', age: 50},
        {name: 'George Oscar', age: 28},
        {name: 'Buster', age: 25}
      ];
    }, 2000);


  });
})();
